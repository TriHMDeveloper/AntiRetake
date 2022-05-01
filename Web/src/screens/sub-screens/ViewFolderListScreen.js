import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Messages } from '../../assets/Messages';
import { ToastType, ViewStudySetType } from '../../assets/TypeEnum';
import FolderCardComponent from '../../components/FolderCardComponent';
import SearchComponent from '../../components/SearchComponent';
import ToastComponent from '../../components/ToastComponent';
import { getViewFolderCard, resetFolder, resetToggle } from '../../redux/reducers/ViewFolderCardSlice';
import {
  isEndViewFolderCardSelector,
  isErrorViewFolderCardSelector,
  isLoadingViewFolderCardSelector,
  viewFolderCardSelector,
  resetViewFolderCardSelector,
} from '../../redux/selectors/ViewFolderCardSelector';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import classApi from '../../api/classApi';
import ConfirmDeleteComponent from '../../components/ConfirmDeleteComponent';

const PAGE_LIMIT = 9;

const ViewFolderListScreen = () => {
  const viewFolderCards = useSelector(viewFolderCardSelector);
  const isLoading = useSelector(isLoadingViewFolderCardSelector);
  const isError = useSelector(isErrorViewFolderCardSelector);
  const isEnd = useSelector(isEndViewFolderCardSelector);
  const reset = useSelector(resetViewFolderCardSelector);
  const dispatch = useDispatch();

  let limit = PAGE_LIMIT;
  const [searchText, setSearchText] = useState('');
  const { userId, classId } = useParams();

  const [folderDelete, setFolderDelete] = useState({ id: '', name: '' });

  const [showConfirmDeleteClass, setShowConfirmDeleteClass] = useState(false);
  const handleCloseConfirmDeleteClass = () => setShowConfirmDeleteClass(false);
  const handleShowConfirmDeleteClass = () => setShowConfirmDeleteClass(true);
  const handleDeleteConfirmDeleteClass = async () => {
    try {
      await classApi.removeFolder({ classId: classId, folderId: folderDelete.id });
      dispatch(resetToggle());
      dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG37 }));
      dispatch(setShow(true));
      handleCloseConfirmDeleteClass();
    } catch (error) {
      handleCloseConfirmDeleteClass();
      dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: error }));
      dispatch(setShow(true));
    }
  };

  const getType = () => {
    if (userId) {
      return ViewStudySetType.USER;
    }
    if (classId) {
      return ViewStudySetType.CLASS;
    }
  };

  const getId = () => {
    if (userId) {
      return userId;
    }
    if (classId) {
      return classId;
    }
  };

  useEffect(() => {
    dispatch(resetFolder());
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEnd]);

  useEffect(() => {
    dispatch(
      getViewFolderCard({
        limit: PAGE_LIMIT,
        searchText: searchText,
        id: getId(),
        type: getType(),
      })
    );
  }, [searchText, reset]);

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
        getViewFolderCard({
          limit: limit,
          searchText: searchText,
          id: getId(),
          type: getType(),
        })
      );
    }
  };
  const renderViewFolderCard = () => {
    const renderViewFolderCardData = viewFolderCards.map((flashInfo) => {
      return (
        <Col className="px-4 py-3" key={flashInfo.id}>
          {userId ? (
            <FolderCardComponent flashInfo={flashInfo} selectable={false} />
          ) : (
            <FolderCardComponent
              flashInfo={flashInfo}
              selectable={false}
              removable={true}
              handleShowDelete={handleShowConfirmDeleteClass}
              setFolderDelete={setFolderDelete}
            />
          )}
        </Col>
      );
    });
    return renderViewFolderCardData;
  };
  // const renderViewFolderCardData = viewFolderCards.map((flashInfo) => {
  //   return (
  //     <Col className="px-4 py-3" key={flashInfo.id}>
  //       <FolderCardComponent flashInfo={flashInfo} selectable={false} />
  //     </Col>
  //   );
  // });

  return (
    <div className="mt-3">
      <Row className="mx-0 d-flex justify-content-end ">
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
        {renderViewFolderCard()}
      </Row>
      {isLoading ? (
        <CircularProgress className="mt-2" />
      ) : viewFolderCards.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : null}
      <Row className="my-4"></Row>
      <ConfirmDeleteComponent
        content={Messages.mSG35(folderDelete.name)}
        show={showConfirmDeleteClass}
        handleClose={handleCloseConfirmDeleteClass}
        handleDelete={handleDeleteConfirmDeleteClass}
      />
    </div>
  );
};

export default ViewFolderListScreen;
