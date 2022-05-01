import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import { getUserInfo } from '../redux/reducers/UserInfoSlice'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Messages } from '../../assets/Messages';
import { ToastType } from '../../assets/TypeEnum';
import PaginationComponent from '../../components/PaginationComponent';
import ToastComponent from '../../components/ToastComponent';
import UserCardComponent from '../../components/UserCardComponent';
import { getSearchUserCard } from '../../redux/reducers/SearchUserCardSlice';
import {
  isErrorSearchUserCardSelector,
  isLoadingSearchUserCardSelector,
  searchUserCardSelector,
  totalSearchUserCardSelector,
} from '../../redux/selectors/SearchUserCardSelector';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';

const PAGE_LIMIT = 9;

const ViewUserListOfSearchScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const searchUserCards = useSelector(searchUserCardSelector);
  const totalCards = useSelector(totalSearchUserCardSelector);
  const isLoading = useSelector(isLoadingSearchUserCardSelector);
  const isError = useSelector(isErrorSearchUserCardSelector);
  const dispatch = useDispatch();

  const searchText = searchParams.get('name');
  const page = searchParams.get('page');
  // const [pageNums, setPageNums] = useState(1)

  useEffect(() => {
    if (!location.search) {
      setSearchParams({ name: '', page: 1 });
    } else {
      dispatch(getSearchUserCard({ page: page, limit: PAGE_LIMIT, searchText: searchText }));
    }
  }, [page, searchText]);

  useEffect(() => {
    if (isError) {
      dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG28 }));
      dispatch(setShow(true));
    }
  }, [isError]);

  const renderSearchUserCardData = searchUserCards.map((userCard) => {
    return (
      <Col className="px-4 py-3" key={userCard.uid}>
        <UserCardComponent userCard={userCard} />
      </Col>
    );
  });

  return (
    <div className="mt-3">
      {isLoading ? (
        <CircularProgress />
      ) : searchUserCards.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : (
        <div>
          <Row xs={1} md={2} lg={3} className="my-4">
            {renderSearchUserCardData}
          </Row>
          <Row className="my-4">
            <Col className="justify-content-center d-flex">
              <PaginationComponent
                totalPage={Math.ceil(totalCards / PAGE_LIMIT)}
                page={page}
                // setPageNums={setPageNums}
              />
            </Col>
          </Row>
        </div>
      )}

      {isError ? <ToastComponent type={ToastType.ERROR} title={'ERROR'} description={Messages.MSG28} /> : null}
    </div>
  );
};

export default ViewUserListOfSearchScreen;
