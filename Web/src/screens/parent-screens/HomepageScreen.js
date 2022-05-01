import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import QuestionCardComponent from '../../components/QuestionCardComponent';
import StudySetCardCarouselComponent from '../../components/StudySetCardCarouselComponent';
import { getHomepageCard } from '../../redux/reducers/HomepageCardSlice';
import {
  homepageCardSelector,
  isLoadingHomepageCard,
  recommendCardSelector,
} from '../../redux/selectors/HomepageCardSelector';
import { auth } from '../../config/firebase-config';
import { useLocation } from 'react-router';

const HomepageScreen = () => {
  const homepageCards = useSelector(homepageCardSelector);
  const recommendCards = useSelector(recommendCardSelector);
  const isLoading = useSelector(isLoadingHomepageCard);
  const dispatch = useDispatch();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [thisWeekStudySets, setThisWeekStudySets] = useState([]);
  const [lastWeekStudySets, setLastWeekStudySets] = useState([]);
  const [olderStudySets, setOlderStudySets] = useState([]);

  useEffect(() => {
    dispatch(getHomepageCard());
  }, [location.key]);

  useEffect(() => {
    if (!isLoading) {
      setThisWeekStudySets(homepageCards.thisWeek);
      setLastWeekStudySets(homepageCards.lastWeek);
      setOlderStudySets(homepageCards.older);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const delaySearch = setTimeout(() => {
        handleSearchChange(search);
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [search]);

  const handleSearchChange = (searchTerm) => {
    setThisWeekStudySets(
      homepageCards.thisWeek.filter((studySet) => {
        return studySet.name.includes(searchTerm);
      })
    );
    setLastWeekStudySets(
      homepageCards.lastWeek.filter((studySet) => {
        return studySet.name.includes(searchTerm);
      })
    );
    setOlderStudySets(
      homepageCards.older.filter((studySet) => {
        return studySet.name.includes(searchTerm);
      })
    );
  };

  const renderHomepageStudySets = (isLoading, data) => {
    if (data.length === 0) {
      return (
        <Row>
          <Col className="big-font text-center my-5">No Result</Col>
        </Row>
      );
    }
    return <StudySetCardCarouselComponent homepageCards={data} />;
  };

  const renderRecommendQuestionCardData = recommendCards.questionList.map((questionCard) => {
    return (
      <Col className="px-4" key={questionCard.id}>
        <QuestionCardComponent questionInfoData={questionCard} />
      </Col>
    );
  });

  return (
    <Container className="mt-4">
      {homepageCards.thisWeek.length !== 0 ||
      homepageCards.lastWeek.length !== 0 ||
      homepageCards.older.length !== 0 ? (
        <>
          <Row className="mb-4">
            <Col md={8} className="giant-font theme-text-color text-start ps-3 my-2">
              Study History
            </Col>
            <Col className="my-2 ms-1">
              <TextField
                fullWidth
                size="small"
                id="outlined-basic"
                label="Search"
                variant="outlined"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
          </Row>
          {homepageCards.thisWeek.length !== 0 ? (
            <>
              <Divider textAlign="left" className="big-font align-middle">
                This week
              </Divider>
              <div className="mt-4 mb-4">{renderHomepageStudySets(isLoading, thisWeekStudySets)}</div>
            </>
          ) : (
            <></>
          )}
          {homepageCards.lastWeek.length !== 0 ? (
            <>
              <Divider textAlign="left" className="big-font">
                Last week
              </Divider>
              <div className="mt-4 mb-4">{renderHomepageStudySets(isLoading, lastWeekStudySets)}</div>
            </>
          ) : (
            <></>
          )}
          {homepageCards.older.length !== 0 ? (
            <>
              <Divider textAlign="left" className="big-font">
                Older weeks
              </Divider>
              <div className="mt-4 mb-4">{renderHomepageStudySets(isLoading, olderStudySets)}</div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <Row className="mb-4">
        <Col className="giant-font theme-text-color text-start ps-3 my-2">Recommendation</Col>
      </Row>
      <Divider textAlign="left" className="big-font">
        Study Set
      </Divider>
      <div className="mt-4 mb-5">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <StudySetCardCarouselComponent homepageCards={recommendCards.studySetList} />
        )}
      </div>
      <Divider textAlign="left" className="big-font">
        Question
      </Divider>
      <div className="mt-4 mb-5">{isLoading ? <CircularProgress /> : renderRecommendQuestionCardData}</div>
    </Container>
  );
};

export default HomepageScreen;
