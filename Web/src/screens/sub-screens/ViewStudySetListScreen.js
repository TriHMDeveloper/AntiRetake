import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import classApi from '../../api/classApi';
import FolderApi from '../../api/folderApi';
import { Messages } from '../../assets/Messages';
import { SortBy, TagType, ToastType, ViewStudySetType } from '../../assets/TypeEnum';
import ConfirmDeleteComponent from '../../components/ConfirmDeleteComponent';
import FilterComponent from '../../components/FilterComponent';
import SearchComponent from '../../components/SearchComponent';
import SortComponent from '../../components/SortComponent';
import StudySetCardComponent from '../../components/StudySetCardComponent';
import ToastComponent from '../../components/ToastComponent';
import { getClassByID } from '../../redux/reducers/CreateClassSlice';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';
import { getViewStudySetCard, resetStudySet, resetToggle } from '../../redux/reducers/ViewStudySetCardSlice';
import {
  isEndViewStudySetCardSelector,
  isErrorViewStudySetCardSelector,
  isLoadingViewStudySetCardSelector,
  resetViewStudySetCardSelector,
  viewStudySetCardSelector,
} from '../../redux/selectors/ViewStudySetCardSelector';

const PAGE_LIMIT = 9;
const LISTITEMSORT = [
  { value: SortBy.DATE, title: 'Date' },
  { value: SortBy.STAR, title: 'Star' },
];

const ViewStudySetListScreen = ({ resetFolder }) => {
  const viewStudySetCards = useSelector(viewStudySetCardSelector);
  const isLoading = useSelector(isLoadingViewStudySetCardSelector);
  const isError = useSelector(isErrorViewStudySetCardSelector);
  const isEnd = useSelector(isEndViewStudySetCardSelector);
  const reset = useSelector(resetViewStudySetCardSelector);
  const dispatch = useDispatch();

  let limit = PAGE_LIMIT;
  const [filter, setFilter] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState(SortBy.DATE);
  const { userId, classId, folderId } = useParams();

  const [studySetDelete, setStudySetDelete] = useState({ id: '', name: '' });

  const [showConfirmDeleteClass, setShowConfirmDeleteClass] = useState(false);
  const handleCloseConfirmDeleteClass = () => setShowConfirmDeleteClass(false);
  const handleShowConfirmDeleteClass = () => setShowConfirmDeleteClass(true);
  const handleDeleteConfirmDeleteClass = async () => {
    try {
      if (classId) {
        await classApi.removeStudySet({ classId: classId, studySetId: studySetDelete.id });
        dispatch(resetToggle());
        dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG36 }));
        dispatch(setShow(true));
        dispatch(getClassByID(classId));
      } else if (folderId) {
        await FolderApi.removeStudySet({ folderId: folderId, studySetId: studySetDelete.id });
        dispatch(resetToggle());
        dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG38 }));
        dispatch(setShow(true));
        resetFolder();
      }
      handleCloseConfirmDeleteClass();
    } catch (error) {
      handleCloseConfirmDeleteClass();
    }
  };

  const splitCurrentTags = (currentTags) => {
    let subject = [];
    let textbook = [];
    let school = [];
    if (currentTags) {
      currentTags.map((tag) => {
        if (tag.type === TagType.TEXTBOOK) {
          textbook.push(tag.id);
        }
        if (tag.type === TagType.SUBJECT) {
          subject.push(tag.id);
        }
        if (tag.type === TagType.SCHOOL) {
          school.push(tag.id);
        }
      });
    }
    return { subject: subject, textbook: textbook, school: school };
  };

  const getType = () => {
    if (userId) {
      return ViewStudySetType.USER;
    }
    if (classId) {
      return ViewStudySetType.CLASS;
    }
    if (folderId) {
      return ViewStudySetType.FOLDER;
    }
  };

  const getId = () => {
    if (userId) {
      return userId;
    }
    if (classId) {
      return classId;
    }
    if (folderId) {
      return folderId;
    }
  };

  useEffect(() => {
    dispatch(resetStudySet());
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEnd]);

  useEffect(() => {
    dispatch(
      getViewStudySetCard({
        limit: PAGE_LIMIT,
        filter: splitCurrentTags(filter),
        sortBy: sortBy,
        searchText: searchText,
        id: getId(),
        type: getType(),
      })
    );
  }, [filter, sortBy, searchText, reset]);

  useEffect(() => {
    if (isError) {
      dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG28 }));
      dispatch(setShow(true));
    }
  }, [isError]);

  const handleScroll = (e) => {
    if (
      window.innerHeight + e.target.documentElement.scrollTop + 0.5 >= e.target.documentElement.scrollHeight &&
      !isEnd
    ) {
      limit += PAGE_LIMIT;
      dispatch(
        getViewStudySetCard({
          pageNums: 1,
          limit: limit,
          filter: splitCurrentTags(filter),
          sortBy: sortBy,
          searchText: searchText,
          id: getId(),
          type: getType(),
        })
      );
    }
    e.preventdefault;
  };

  const renderViewStudySetCardData = viewStudySetCards.map((studySetCard) => {
    return (
      <Col className="px-4 py-3" key={studySetCard.id}>
        {userId ? (
          <StudySetCardComponent studySet={studySetCard} />
        ) : (
          <StudySetCardComponent
            studySet={studySetCard}
            removable={true}
            handleShowDelete={handleShowConfirmDeleteClass}
            setStudySetDelete={setStudySetDelete}
          />
        )}
      </Col>
    );
  });

  return (
    <div className="mt-3">
      <Row className="mx-0">
        <Col md={5}>
          <FilterComponent setFilter={setFilter} type={[TagType.SUBJECT, TagType.TEXTBOOK]} filter={filter} />
        </Col>
        <Col md={3} className="justify-content-end d-flex">
          <SortComponent listItemSort={LISTITEMSORT} setSortBy={setSortBy} />
        </Col>
        <Col md={4}>
          <SearchComponent
            className="mt-2"
            fullWidth
            id="outlined-basic"
            label="Search"
            variant="outlined"
            setSearch={setSearchText}
          />
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="my-4">
        {renderViewStudySetCardData}
      </Row>
      {isLoading ? (
        <CircularProgress className="mt-2" />
      ) : viewStudySetCards.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : null}
      {isError ? <ToastComponent type={ToastType.ERROR} title={'ERROR'} description={Messages.MSG28} /> : null}
      <ConfirmDeleteComponent
        content={classId ? Messages.mSG35(studySetDelete.name) : Messages.mSG42(studySetDelete.name)}
        show={showConfirmDeleteClass}
        handleClose={handleCloseConfirmDeleteClass}
        handleDelete={handleDeleteConfirmDeleteClass}
      />
    </div>
  );
};

export default ViewStudySetListScreen;
