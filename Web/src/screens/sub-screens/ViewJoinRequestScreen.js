import { React, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { SortBy, ToastType } from '../../assets/TypeEnum';
import { useParams, useLocation } from 'react-router-dom';
import JoinRequestCardComponent from '../../components/JoinRequestCardComponent';
import SearchComponent from '../../components/SearchComponent';
import SortComponent from '../../components/SortComponent';
import { getJoinRequestClassByID } from '../../redux/reducers/JoinRequestSlice';
import {
  joinRequestSelector,
  isLoadingJoinRequestSelector,
  isErrorJoinRequestSelector,
} from '../../redux/selectors/JoinRequestSelector';
import { CircularProgress } from '@mui/material';
import { Messages } from '../../assets/Messages';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';

const LISTITEMSORT = [
  { value: SortBy.DATE, title: 'Newest' },
  { value: SortBy.OLDDATE, title: 'Oldest' },
];

const ViewJoinRequestScreen = () => {
  const { classId } = useParams();
  const joinRequest = useSelector(joinRequestSelector);
  const [joinRequests, setJoinRequests] = useState([]);
  const isLoading = useSelector(isLoadingJoinRequestSelector);
  const isError = useSelector(isErrorJoinRequestSelector);
  const location = useLocation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(SortBy.DATE);

  useEffect(() => {
    dispatch(getJoinRequestClassByID(classId));
  }, [location.key]);

  useEffect(() => {
    if (!isLoading) {
      if (sortBy !== SortBy.DATE) {
        setJoinRequests(
          joinRequest.slice().sort((a, b) => {
            return new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime();
          })
        );
      } else {
        setJoinRequests(
          joinRequest
            .slice()
            .sort((a, b) => {
              return new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime();
            })
            .reverse()
        );
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const delaySearch = setTimeout(() => {
        // Send Axios request here
        handleSearchChange(search);
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [search]);

  useEffect(() => {
    if (!isLoading) {
      if (sortBy !== SortBy.DATE) {
        setJoinRequests(
          joinRequest.slice().sort((a, b) => {
            return new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime();
          })
        );
      } else {
        setJoinRequests(
          joinRequest
            .slice()
            .sort((a, b) => {
              return new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime();
            })
            .reverse()
        );
      }
    }
  }, [sortBy]);

  const handleSearchChange = (searchTerm) => {
    setJoinRequests(
      joinRequest.filter((request) => {
        return request.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  useEffect(() => {
    if (isError) {
      dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG28 }));
      dispatch(setShow(true));
    }
  }, [isError]);

  const renderJoinRequestList = joinRequests.map((item, index) => {
    return (
      <div key={item.id} className="my-3 px-4">
        <JoinRequestCardComponent joinRequestDetail={item} />
      </div>
    );
  });

  return (
    <div className="mt-4 mb-4">
      <Row className="mx-0">
        <Col md={5}></Col>
        <Col md={3} className="justify-content-end d-flex">
          <SortComponent listItemSort={LISTITEMSORT} setSortBy={setSortBy} />
        </Col>
        <Col md={4}>
          <SearchComponent setSearch={setSearch} />
        </Col>
      </Row>
      {isLoading ? (
        <CircularProgress className="mt-2" />
      ) : joinRequest.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : (
        renderJoinRequestList
      )}
    </div>
  );
};

export default ViewJoinRequestScreen;
