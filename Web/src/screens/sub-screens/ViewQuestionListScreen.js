import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Messages } from '../../assets/Messages';
import { TagType, ToastType, SortBy } from '../../assets/TypeEnum';
import FilterComponent from '../../components/FilterComponent';
import QuestionCardComponent from '../../components/QuestionCardComponent';
import SearchComponent from '../../components/SearchComponent';
import SortComponent from '../../components/SortComponent';
import ToastComponent from '../../components/ToastComponent';
import { getQuestionCard, resetQuestion } from '../../redux/reducers/ViewQuestionCardSlice';
import {
  isEndViewQuestionCardSelector,
  isErrorViewQuestionCardSelector,
  isLoadingViewQuestionCardSelector,
  viewQuestionCardSelector,
} from '../../redux/selectors/ViewQuestionCardSelector';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';

const PAGE_LIMIT = 9;
const LISTITEMSORT = [
  { value: SortBy.DATE, title: 'Date' },
  { value: SortBy.VOTE, title: 'Most voted' },
];

const ViewQuestionListScreen = () => {
  const viewQuestionCards = useSelector(viewQuestionCardSelector);
  const isLoading = useSelector(isLoadingViewQuestionCardSelector);
  const isError = useSelector(isErrorViewQuestionCardSelector);
  let isEnd = useSelector(isEndViewQuestionCardSelector);
  const dispatch = useDispatch();
  // const [isLoading,setIsLoading] = useState(true)

  let limit = PAGE_LIMIT;
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(SortBy.DATE);
  const { userId } = useParams();

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
    dispatch(resetQuestion());
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEnd]);

  useEffect(() => {
    dispatch(
      getQuestionCard({
        limit: PAGE_LIMIT,
        filter: splitCurrentTags(filter),
        sortBy: sortBy,
        search: search,
        id: userId,
      })
    );
  }, [filter, sortBy, search]);

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
      if (limit >= 18) {
        isEnd = true;
      } //TODO: xoa sau khi co backend
      dispatch(
        getQuestionCard({
          limit: limit,
          filter: splitCurrentTags(filter),
          sortBy: sortBy,
          search: search,
          id: userId,
        })
      );
    }
  };

  const renderQuestionCardData = viewQuestionCards.map((questionCard) => {
    return (
      <Col className="px-4 py-3" key={questionCard.id}>
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
            type={[TagType.SCHOOL, TagType.SUBJECT, TagType.TEXTBOOK]}
            filter={filter}
          />
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
            setSearch={setSearch}
          />
        </Col>
      </Row>
      <Row xs={1} md={1} lg={1} className="my-4">
        {renderQuestionCardData}
      </Row>
      {isLoading ? (
        <CircularProgress className="mt-2" />
      ) : viewQuestionCards.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : null}

      {isError ? <ToastComponent type={ToastType.ERROR} title={'ERROR'} description={Messages.MSG28} /> : null}
    </div>
  );
};

export default ViewQuestionListScreen;
