import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import { getUserInfo } from '../redux/reducers/UserInfoSlice'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Messages } from '../../assets/Messages';
import { SortBy, TagType, ToastType } from '../../assets/TypeEnum';
import ClassCardComponent from '../../components/ClassCardComponent';
import FilterComponent from '../../components/FilterComponent';
import PaginationComponent from '../../components/PaginationComponent';
import SortComponent from '../../components/SortComponent';
import { getSearchClassCard } from '../../redux/reducers/SearchClassCardSlice';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';
import {
  isErrorSearchClassCardSelector,
  isLoadingSearchClassCardSelector,
  searchClassCardSelector,
  totalSearchClassCardSelector,
} from '../../redux/selectors/SearchClassCardSelector';

const PAGE_LIMIT = 9;
const LISTITEMSORT = [
  { value: SortBy.DATE, title: 'Date' },
  { value: SortBy.ALPHABET, title: 'Alphabet' },
];

const ViewClassListOfSearchScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchClassCards = useSelector(searchClassCardSelector);
  const totalCards = useSelector(totalSearchClassCardSelector);
  const isLoading = useSelector(isLoadingSearchClassCardSelector);
  const isError = useSelector(isErrorSearchClassCardSelector);
  const dispatch = useDispatch();
  // const [isLoading,setIsLoading] = useState(true)

  const searchText = searchParams.get('name');
  const page = searchParams.get('page');
  const location = useLocation();
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState(SortBy.DATE);

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
        getSearchClassCard({
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

  const renderSearchClassCardData = searchClassCards.map((classCard) => {
    return (
      <Col className="px-4 py-3" key={classCard.id}>
        <ClassCardComponent classCard={classCard} />
      </Col>
    );
  });

  return (
    <div className="mt-3">
      <Row className="mx-0">
        <Col md={5}>
          <FilterComponent setFilter={setFilter} type={[TagType.SCHOOL]} filter={filter} />
        </Col>
        <Col></Col>
        <Col md={3} className="justify-content-end d-flex">
          <SortComponent listItemSort={LISTITEMSORT} setSortBy={setSortBy} />
        </Col>
      </Row>
      {isLoading ? (
        <CircularProgress />
      ) : searchClassCards.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : (
        <div>
          <Row xs={1} md={2} lg={3} className="my-4">
            {renderSearchClassCardData}
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
    </div>
  );
};

export default ViewClassListOfSearchScreen;
