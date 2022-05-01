import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useSearchParams, useLocation } from 'react-router-dom';
import PaginationComponent from '../../components/PaginationComponent';
import FilterComponent from '../../components/FilterComponent';
import SortComponent from '../../components/SortComponent';
import QuestionCardComponent from '../../components/QuestionCardComponent';
import CircularProgress from '@mui/material/CircularProgress';
import ToastComponent from '../../components/ToastComponent';
import { SortBy, TagType, ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';

// import { getUserInfo } from '../redux/reducers/UserInfoSlice'
import { useSelector, useDispatch } from 'react-redux';
import {
  searchQuestionCardSelector,
  isLoadingSearchQuestionCardSelector,
  isErrorSearchQuestionCardSelector,
  totalSearchQuestionCardSelector,
} from '../../redux/selectors/SearchQuestionCardSelector';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import { getSearchQuestionCard } from '../../redux/reducers/SearchQuestionCardSlice';

const PAGE_LIMIT = 5;
const LIST_ITEM_SORT = [
  { value: SortBy.VOTE, title: 'Most voted' },
  { value: SortBy.DATE, title: 'Date' },
];

const ViewQuestionListOfSearchScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuestionCards = useSelector(searchQuestionCardSelector);
  const totalCards = useSelector(totalSearchQuestionCardSelector);
  const isLoading = useSelector(isLoadingSearchQuestionCardSelector);
  const isError = useSelector(isErrorSearchQuestionCardSelector);
  const dispatch = useDispatch();
  // const [isLoading,setIsLoading] = useState(true)

  const searchText = searchParams.get('name');
  const page = searchParams.get('page');
  const location = useLocation();
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState(SortBy.VOTE);

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
        getSearchQuestionCard({
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

  const renderSearchQuestionCardData = searchQuestionCards.map((questionCard) => {
    return (
      <Col className="px-4" key={questionCard.id}>
        <QuestionCardComponent questionInfoData={questionCard} />
      </Col>
    );
  });

  return (
    <div className="mt-3">
      <Row className="mx-0">
        <Col md={5}>
          <FilterComponent
            setFilter={setFilter}
            type={[TagType.SCHOOL, TagType.TEXTBOOK, TagType.SUBJECT]}
            filter={filter}
          />
        </Col>
        <Col></Col>
        <Col md={3} className="justify-content-end d-flex">
          <SortComponent listItemSort={LIST_ITEM_SORT} setSortBy={setSortBy} />
        </Col>
      </Row>
      {isLoading ? (
        <CircularProgress />
      ) : searchQuestionCards.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : (
        <div>
          <Row xs={1} md={1} lg={1} className="my-4">
            {renderSearchQuestionCardData}
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

export default ViewQuestionListOfSearchScreen;
