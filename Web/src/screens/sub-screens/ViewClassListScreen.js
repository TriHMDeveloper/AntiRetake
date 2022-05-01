import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import { getUserInfo } from '../redux/reducers/UserInfoSlice'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Messages } from '../../assets/Messages';
import { TagType, ToastType, SortBy } from '../../assets/TypeEnum';
import ClassCardComponent from '../../components/ClassCardComponent';
import FilterComponent from '../../components/FilterComponent';
import SearchComponent from '../../components/SearchComponent';
import SortComponent from '../../components/SortComponent';
import ToastComponent from '../../components/ToastComponent';
import { getViewClassCard, resetClass } from '../../redux/reducers/ViewClassCardSlice';
import {
  isEndViewClassCardSelector,
  isErrorViewClassCardSelector,
  isLoadingViewClassCardSelector,
  viewClassCardSelector,
} from '../../redux/selectors/ViewClassCardSelector';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';

const PAGE_LIMIT = 9;
const LISTITEMSORT = [
  { value: SortBy.DATE, title: 'Date' },
  { value: SortBy.ALPHABET, title: 'Alphabet' },
];

const ViewClassListOfSearchScreen = () => {
  const viewClassCards = useSelector(viewClassCardSelector);
  const isLoading = useSelector(isLoadingViewClassCardSelector);
  const isError = useSelector(isErrorViewClassCardSelector);
  let isEnd = useSelector(isEndViewClassCardSelector);
  const dispatch = useDispatch();
  // const [isLoading,setIsLoading] = useState(true)

  let limit = PAGE_LIMIT;
  const [filter, setFilter] = useState([]);
  const [searchText, setSearchText] = useState('');
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
    dispatch(resetClass());
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEnd]);

  useEffect(() => {
    dispatch(
      getViewClassCard({
        limit: PAGE_LIMIT,
        filter: splitCurrentTags(filter),
        sortBy: sortBy,
        searchText: searchText,
        id: userId,
      })
    );
  }, [filter, sortBy, searchText]);

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
        getViewClassCard({
          limit: limit,
          filter: splitCurrentTags(filter),
          sortBy: sortBy,
          searchText: searchText,
          id: userId,
        })
      );
    }
  };

  const renderViewClassCardData = viewClassCards.map((classCard) => {
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
        {renderViewClassCardData}
      </Row>
      {isLoading ? (
        <CircularProgress className="mt-2" />
      ) : viewClassCards.length === 0 ? (
        <Col className="big-font text-center my-5">{Messages.MSG06}</Col>
      ) : null}
    </div>
  );
};

export default ViewClassListOfSearchScreen;
