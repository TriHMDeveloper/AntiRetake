import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import styles from '../styles/component-styles/QuestionCardComponent-style.module.css';
import TagComponent from './TagComponent';
import { Link } from 'react-router-dom';

const QuestionCardComponent = ({ questionInfoData }) => {
  const {
    id,
    title,
    createdAt,
    owner,
    content,
    numOfUpvotes,
    numOfDownvotes,
    numOfComments,
    textbooks,
    subjects,
    schools,
  } = questionInfoData;

  const renderSubjectTag = subjects.map((subject) => {
    return (
      <Col key={subject.id}>
        <TagComponent name={subject.name} type="subject" />
      </Col>
    );
  });

  const renderTextBookTag = textbooks.map((textbook) => {
    return (
      <Col key={textbook.id}>
        <TagComponent name={textbook.name} type="textbook" />
      </Col>
    );
  });

  const renderSchoolTag = schools.map((school) => {
    return (
      <Col key={school.id}>
        <TagComponent name={school.name} type="school" />
      </Col>
    );
  });

  return (
    <Container className="shadow-box white-background-color mb-4 pt-2">
      <Row className="pt-1">
        <Col xs={2} md={2} lg={1} className="m-auto text-center">
          <Image src={owner.avaUrl} roundedCircle="true" width={50} height={50} referrerPolicy="no-referrer"></Image>
        </Col>
        <Col xs={10} md={10} lg={11} className={`mt-3 ${styles.text_style}`}>
          <Row>
            <Col md={11} xs={11}>
              <Link
                to={{ pathname: `/forum/${id}` }}
                className={`w-100 ${styles.link_black_style} ${styles.short_text}`}
              >
                {title}
              </Link>
            </Col>
          </Row>
          <Row md="auto" xs="auto">
            <Col>
              <p className={styles.font_small}>{owner.name}</p>
            </Col>
            <Col>
              <p className={styles.font_small}>{createdAt}</p>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="my-1 text-start">
        <p>
          {content}...{' '}
          <Link to={{ pathname: `/forum/${id}` }} className={`${styles.link_gray_style}`}>
            View detail
          </Link>
        </p>
      </Row>
      <Row>
        <Col xs={12} md={7} lg={8}>
          <Row md="auto" className="mb-2">
            {renderSubjectTag}
            {renderTextBookTag}
            {renderSchoolTag}
          </Row>
        </Col>
        <Col xs={12} md={5} lg={4} className="p-0">
          <Row className="pb-2 m-0 text-center">
            <Col xs={6} md={6} className="text-end">
              <p>
                {numOfUpvotes - numOfDownvotes >= 0 ? (
                  <i className="fas fa-arrow-up me-2"></i>
                ) : (
                  <i className="fas fa-arrow-down me-2"></i>
                )}
                {Math.abs(numOfUpvotes - numOfDownvotes)} votes
              </p>
            </Col>
            <Col xs={6} md={6} className=" text-end">
              <p>{numOfComments} comments</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionCardComponent;
