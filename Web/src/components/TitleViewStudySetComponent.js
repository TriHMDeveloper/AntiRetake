import { React, useState } from 'react';
import styles from '../styles/component-styles/TitleViewStudySetStyle.module.css';
import RateStarComponent from './RateStarComponent.js';
import TagComponent from './TagComponent';
import { Row, Col } from 'react-bootstrap';

const TitleViewStudySetComponent = ({ studySetInfo }) => {
  const {
    id,
    owner,
    name,
    rating,
    currentUserRating,
    numOfRates,
    createdAt,
    numOfTerms,
    description,
    subject,
    textbook,
    accessModifier,
  } = studySetInfo;
  const percent = (rating / 5) * 100 + '%';
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Row className="m-0 mt-4">
        <Col xs={3} md="auto" lg="auto">
          <i className={`fas fa-book mt-2 ${styles.book_icon}`} />
        </Col>
        <Col xs={9} md="auto" lg="auto" className="">
          <Row>
            <Col>
              <div className="d-flex blur-text-color text-center big-font">
                create by<p className={'mb-0 fw-bolder theme-text-color big-font'}>&nbsp;{owner.name}</p>
              </div>
            </Col>
          </Row>
          <Row className="giant-font m-0 text-start bold-black-text-color">
            {name}
            {/* <p className={` ${styles.study_set_name}`}>{name}</p> */}
          </Row>
          <Row className="">
            {/* <Col xs={2} md="auto" lg="auto" className="text-start">
              <div className="big-font blur-text-color">{rating}</div>
            </Col> */}
            <Col className="d-flex align-items-center text-start" xs={6} md="auto" lg="auto">
              <div className="big-font blur-text-color me-3">{rating}</div>
              <div className={'d-flex align-items-center big-font'}>
                <div className={`d-flex ${styles.back_stars}`}>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <div className={`d-flex ${styles.front_stars}`} style={{ width: percent }}>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={3} md="auto" lg="auto" className="text-start">
              <div className="big-font blur-text-color">{numOfRates}&nbsp;rates</div>
            </Col>
            {!isNaN(currentUserRating) ? (
              <Col xs="auto" md="auto" lg="auto">
                <div className={`background-color big-font text-start ${styles.rates_icon}`} onClick={handleShow}>
                  Rate for study set
                </div>
              </Col>
            ) : (
              <></>
            )}
          </Row>
          <Row>
            {subject.name ? (
              <Col xs="auto" md="auto" lg="auto">
                <TagComponent name={subject.name} type="subject" />
              </Col>
            ) : (
              <></>
            )}
            {textbook.name ? (
              <Col xs="auto" md="auto" lg="auto">
                <TagComponent name={textbook.name} type="textbook" />
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </Col>
      </Row>
      <Row className="ms-0 me-0 mt-3">
        <Col lg={12}>
          <p className={`text-start blur-text-color ms-2 ${styles.word_wrap_break}`}>{description}</p>
        </Col>
      </Row>
      <RateStarComponent show={show} handleClose={handleClose} chosenStar={currentUserRating} studySetId={id} />
    </div>
  );
};

export default TitleViewStudySetComponent;
