import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Pagination } from 'react-bootstrap';
import { useSearchParams, useLocation } from 'react-router-dom';
import PaginationComponent from '../../components/PaginationComponent';
import FilterComponent from '../../components/FilterComponent';
import SortComponent from '../../components/SortComponent';
import StudySetCardComponent from '../../components/StudySetCardComponent';
import CircularProgress from '@mui/material/CircularProgress';
import ToastComponent from '../../components/ToastComponent';
import { SortBy, TagType, ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';

// import { getUserInfo } from '../redux/reducers/UserInfoSlice'
import { useSelector, useDispatch } from 'react-redux';
import {
  searchStudySetCardSelector,
  isLoadingSearchStudySetCardSelector,
  isErrorSearchStudySetCardSelector,
  totalSearchStudySetCardSelector,
} from '../../redux/selectors/SearchStudySetCardSelector';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import { getSearchStudySetCard } from '../../redux/reducers/SearchStudySetCardSlice';

const PAGE_LIMIT = 9;
const LIST_ITEM_SORT = [
  { value: SortBy.STAR, title: 'Star' },
  { value: SortBy.DATE, title: 'Date' },
];

const ViewStudySetListOfSearchScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const searchStudySetCards = useSelector(searchStudySetCardSelector);
  const totalCards = useSelector(totalSearchStudySetCardSelector);
  const isLoading = useSelector(isLoadingSearchStudySetCardSelector);
  const isError = useSelector(isErrorSearchStudySetCardSelector);
  const dispatch = useDispatch();
  // const [isLoading,setIsLoading] = useState(true)

  const searchText = searchParams.get('name');
  const page = searchParams.get('page');
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState(SortBy.STAR);

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

  useEffect(() => {
    if (!location.search) {
      setSearchParams({ name: '', page: 1 });
    } else {
      dispatch(
        getSearchStudySetCard({
          page: page,
          limit: PAGE_LIMIT,
          filter: splitCurrentTags(filter),
          sortBy: sortBy,
          searchText: searchText,
        })
      );
    }
  }, [page, filter, sortBy, searchText]);

  useEffect(() => {
    if (isError) {
      dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG28 }));
      dispatch(setShow(true));
    }
  }, [isError]);

  const renderSearchStudySetCardData = searchStudySetCards.map((studySetCard) => {
    return (
      <Col className="px-4 py-3" key={studySetCard.id}>
        <StudySetCardComponent studySet={studySetCard} />
      </Col>
    );
  });

  return (
    <div className="mt-3">
      <Row className="mx-0">
        <Col md={5}>
          <FilterComponent setFilter={setFilter} type={[TagType.TEXTBOOK, TagType.SUBJECT]} filter={filter} />
        </Col>
        <Col></Col>
        <Col md={3} className="justify-content-end d-flex">
          <SortComponent listItemSort={LIST_ITEM_SORT} setSortBy={setSortBy} />
        </Col>
      </Row>
      {isLoading ? (
        <CircularProgress />
      ) : searchStudySetCards.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : (
        <div>
          <Row xs={1} md={2} lg={3} className="my-4">
            {renderSearchStudySetCardData}
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

export default ViewStudySetListOfSearchScreen;
