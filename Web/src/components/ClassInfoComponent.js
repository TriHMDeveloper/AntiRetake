import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const ClassInfo = ({ classInfo }) => {
  const { numOfMember, numOfSets, school, owner } = classInfo;

  return (
    <Row className="text-start">
      <Row xs={6} md={6} lg={6} className="pb-3 d-flex align-items-center justify-content-center">
        <Col xs={2} md={1} lg={1} className="d-flex justify-content-center">
          <i className="fas fa-hotel fa-lg text-center big-font theme-text-color " />
        </Col>
        <Col xs={4} md={5} lg={5}>
          <label>{school.name}</label>
        </Col>
        <Col xs={2} md={1} lg={1} className="d-flex justify-content-center ">
          <i className="fas fa-clone fa-lg text-end big-font theme-text-color" />
        </Col>
        <Col xs={4} md={5} lg={5}>
          <label>{numOfSets} study sets</label>
        </Col>
      </Row>
      <Row xs={6} md={6} lg={6} className="pt-2 d-flex d-flex align-items-center justify-content-center">
        <Col xs={2} md={1} lg={1} className="d-flex justify-content-center">
          <i className="fas fa-user-graduate fa-lg text-end big-font theme-text-color" />
        </Col>
        <Col xs={4} md={5} lg={5}>
          <label>{numOfMember} members</label>
        </Col>
        <Col xs={2} md={1} lg={1} className="d-flex justify-content-center ">
          <i className="fas fa-user-tie fa-lg text-end big-font theme-text-color" />
        </Col>
        <Col xs={4} md={5} lg={5}>
          <label>{owner.name}</label>
        </Col>
      </Row>
    </Row>
  );
};

export default ClassInfo;
