import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CircularProgress from '@mui/material/CircularProgress';
import TitleViewStudySetComponent from '../../components/TitleViewStudySetComponent';
import FlashCardCarouselComponent from '../../components/FlashCardCarouselComponent';
import SortComponent from '../../components/SortComponent';
import StudySetCardComponent from '../../components/StudySetCardComponent';
import TermCardComponent from '../../components/TermCardComponent';
import ToastComponent from '../../components/ToastComponent';
import { SortBy, ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import { closePopupHandler as closeStudysetPopup } from '../../redux/reducers/AddStudysetToClassSlice';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';
import { closeFolderPopupHandler } from '../../redux/reducers/AddFolderToClassSlice';
import AddStudysetToClassPopup from '../popups/AddStudysetToClassPopup';
import AddFolderToClassPopup from '../popups/AddFolderToClassPopup';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import {
  getStudySetInfo,
  getFlashcard,
  getRecommendFlashcard,
  visitStudySet,
  resetInfo,
} from '../../redux/reducers/StudySetSlice';
import {
  studySetInfoSelector,
  flashcardSelector,
  recommendFlashcardSelector,
  totalFlashcardSelector,
  isEndFlashcardSelector,
  isLoadingFlashcardSelector,
  isErrorFlashcardSelector,
} from '../../redux/selectors/StudySetSelector';
import { currentUserInfoSelector } from '../../redux/selectors/CurrentUserInfo';
import StudySetCardCarouselComponent from '../../components/StudySetCardCarouselComponent';
import ConfirmDeleteComponent from '../../components/ConfirmDeleteComponent';
import studySetApi from '../../api/studySetApi';
import { auth } from '../../config/firebase-config';

const LIST_ITEM_SORT = [
  { value: 'default', title: 'Default' },
  { value: SortBy.ALPHABET, title: 'Alphabet' },
];

const PAGE_LIMIT = 100;
const RECOMMEND_LIMIT = 6;

const StudySetScreen = () => {
  const { studySetId } = useParams();
  const location = useLocation();
  const studySetInfo = useSelector(studySetInfoSelector);
  const flashcardList = useSelector(flashcardSelector);
  const recommendFlashcardList = useSelector(recommendFlashcardSelector);
  // const total = useSelector(totalFlashcardSelector);
  const isLoading = useSelector(isLoadingFlashcardSelector);
  const isError = useSelector(isErrorFlashcardSelector);
  const isEnd = useSelector(isEndFlashcardSelector);
  const currentUser = useSelector(currentUserInfoSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const [sortBy, setSortBy] = useState('default');

  const [termCardId, setTermCardId] = useState('');

  const [showStudySet, setShowStudySet] = useState(false);
  const [showFolder, setShowFolder] = useState(false);

  const [showConfirmDeleteClass, setShowConfirmDeleteClass] = useState(false);
  const handleCloseConfirmDeleteClass = () => setShowConfirmDeleteClass(false);
  const handleShowConfirmDeleteClass = () => setShowConfirmDeleteClass(true);
  const handleDeleteConfirmDeleteClass = async () => {
    try {
      await studySetApi.deleteStudySet(studySetInfo.id);
      dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG11 }));
      dispatch(setShow(true));
      handleCloseConfirmDeleteClass();
      navigate(`/users/${currentUser.id}/sets`);
    } catch (error) {
      handleCloseConfirmDeleteClass();
    }
  };

  const handleCloseStudySet = () => {
    setShowStudySet(false);
    //Clear selected Study set (AddStudysetToClassPopup, AddFoldersToClassPopup)
    // dispatch(closeStudysetPopup());
  };
  const handleShowStudySet = () => setShowStudySet(true);

  const handleCloseFolder = () => {
    setShowFolder(false);
    //Clear selected Study set (AddStudysetToClassPopup, AddFoldersToClassPopup)
    dispatch(closeFolderPopupHandler());
  };
  const handleShowFolder = () => setShowFolder(true);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEnd]);

  useEffect(() => {
    dispatch(resetInfo());
    dispatch(getStudySetInfo(studySetId));
  }, [studySetId]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      dispatch(visitStudySet(studySetId));
    }
  }, []);

  useEffect(() => {
    dispatch(getFlashcard({ limit: limit, id: studySetId }));
    dispatch(getRecommendFlashcard(studySetId));
  }, [limit, studySetId]);

  useEffect(() => {
    if (!isLoading) {
      setFlashcards(flashcardList);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (sortBy !== SortBy.ALPHABET) {
        setFlashcards(flashcardList);
      } else {
        setFlashcards(flashcardList.slice().sort((a, b) => a.term.localeCompare(b.term)));
      }
    }
  }, [sortBy]);

  const updateCard = () => {
    const delayUpdateCard = setTimeout(() => {
      setLimit(100);
    }, 500);
    return () => clearTimeout(delayUpdateCard);
  };

  const renderFlashcardData = flashcards.map((flashcard) => {
    return (
      <Col className="px-4" key={flashcard.id}>
        <TermCardComponent termCardData={flashcard} handleShow={handleShowStudySet} setTermCardId={setTermCardId} />
      </Col>
    );
  });

  const renderIcon = () => {
    if (currentUser.id) {
      if (currentUser.id === studySetInfo.owner.id) {
        return (
          <>
            <button className="icon-button me-3" onClick={() => navigate(`/sets/${studySetId}/edit`)}>
              <i className="fas fa-pencil-alt"></i>
            </button>
            <button className="icon-button me-4" onClick={handleShowConfirmDeleteClass}>
              <i className="far fa-trash-alt"></i>
            </button>
          </>
        );
      }
      return (
        <>
          <button className="icon-button me-3" onClick={handleShowFolder}>
            <i className="fas fa-save"></i>
          </button>
        </>
      );
    } else {
      return <></>;
    }
  };

  const handleScroll = (e) => {
    if (
      window.innerHeight + e.target.documentElement.scrollTop + 0.5 >= e.target.documentElement.scrollHeight &&
      !isEnd
    ) {
      setLimit(100);
    }
  };

  const handleClickLearn = () => {
    navigate(`/sets/${studySetId}/learn`);
  };

  if (recommendFlashcardList && Object.keys(studySetInfo).length !== 0) {
    {
      return (
        <Container>
          <TitleViewStudySetComponent studySetInfo={studySetInfo} />
          <Row className="text-end px-4">
            <Col className="text-end px-5">
              {renderIcon()}
              <button className="accept-button white-text-color rounded" type="submit" onClick={handleClickLearn}>
                Learn
              </button>
            </Col>
          </Row>
          <Row>
            <FlashCardCarouselComponent
              flashcardList={flashcardList}
              totalCard={studySetInfo.numOfTerms}
              updateCard={updateCard}
            />
          </Row>
          <Row className="mt-5">
            <Col className="text-start bold-black-text-color big-font align-items-center d-flex">
              Study set have {studySetInfo.numOfTerms} cards
            </Col>
            <Col className="justify-content-end d-flex">
              <SortComponent listItemSort={LIST_ITEM_SORT} setSortBy={setSortBy} />
            </Col>
          </Row>
          {isLoading ? (
            <CircularProgress className="mt-2" />
          ) : flashcardList.length === 0 ? (
            <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
          ) : (
            <Row xs={1} md={1} lg={1} className="my-4">
              {renderFlashcardData}
            </Row>
          )}
          <Row className="mt-5">
            <Col className="text-start bold-black-text-color big-font align-items-center d-flex">Recommend</Col>
          </Row>
          <StudySetCardCarouselComponent homepageCards={recommendFlashcardList} />
          <div className="mb-5" />
          {isError ? <ToastComponent type={ToastType.ERROR} title={'ERROR'} description={Messages.MSG28} /> : null}
          <AddStudysetToClassPopup
            show={showStudySet}
            handleClose={handleCloseStudySet}
            submitButton="Save"
            flashcardId={termCardId}
          />
          <AddFolderToClassPopup
            show={showFolder}
            handleClose={handleCloseFolder}
            studysetName={studySetInfo.name}
            submitButton="Save"
          />
          <ConfirmDeleteComponent
            content={Messages.mSG20(studySetInfo.name)}
            show={showConfirmDeleteClass}
            handleClose={handleCloseConfirmDeleteClass}
            handleDelete={handleDeleteConfirmDeleteClass}
          />
        </Container>
      );
    }
  } else {
    {
      return (
        <Container>
          {isError ? (
            <h1 className="blur-text-color mt-5">Loading View Study Set fail...</h1>
          ) : (
            <CircularProgress className=" mt-5" />
          )}
        </Container>
      );
    }
  }
};

export default StudySetScreen;
