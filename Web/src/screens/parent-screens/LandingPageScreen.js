import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import styles from '../../styles/screen-styles/LandingPage.module.css';
const LandingPage = () => {
  const logo1 = require('../../assets/images/landing1.jpg');
  const logo2 = require('../../assets/images/landing2.jpg');
  const logo3 = require('../../assets/images/landing3.jpg');
  const description1 = require('../../assets/images/landing4.jpg');
  const description2 = require('../../assets/images/landing7.jpg');
  const description3 = require('../../assets/images/landing8.jpg');

  return (
    <Container>
      <Carousel className="mt-5" interval={5000}>
        <Carousel.Item>
          <img src={logo1} className={styles.main_image} />
          <Carousel.Caption>
            <h3>Working Hard</h3>
            <p>Hard work beats talent when talent doesn&apos;t work hard.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={logo2} className={styles.main_image} />
          <Carousel.Caption>
            <h3>Share knowledge</h3>
            <p>Knowledge is power. Sharing knowledge is the key to unlocking that power.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={logo3} className={styles.main_image} />
          <Carousel.Caption>
            <h3>Relax</h3>
            <p>Your mind will answer most questions if you learn to relax and wait for the answer.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <div className={`${styles.text}`}>ANTI-RETAKE will help you improve your scores</div>
      <Row className={'my-4'}>
        <Col className={'my-auto'} xs={12} md={6} lg={6}>
          <h3 className={'text-start'}>You just need to brainstorm, we take care of everything else.</h3>
          <p className={'text-start'}>
            From flashcards to help you learn English, to games that make learning history easy, you can use a variety
            of tools to conquer any challenge.
          </p>
        </Col>
        <Col className="d-flex justify-content-end" xs={12} md={6} lg={6}>
          <img src={description1} className={styles.sub_image} />
        </Col>
      </Row>

      <Row className={'my-4'}>
        <Col
          className="d-flex justify-content-start"
          xs={{ span: 12, order: 'last' }}
          md={{ span: 6, order: 'first' }}
          lg={{ span: 6, order: 'first' }}
        >
          <img src={description2} className={styles.sub_image} />
        </Col>
        <Col
          className={'col my-auto'}
          xs={{ span: 12, order: 'first' }}
          md={{ span: 6, order: 'last' }}
          lg={{ span: 6, order: 'last' }}
        >
          <h3 className={'text-start'}>Your next success is coming keep fighting!!!</h3>
          <p className={'text-start'}>
            Every new knowledge you learn is an achievement. Anti-Retake separate topics and subjects to help you
            improve day by day.
          </p>
        </Col>
      </Row>

      <Row className={'my-4'}>
        <Col className={'my-auto'} xs={12} md={6} lg={6}>
          <h3 className={'text-start'}>Do not give up.Your success will come soon.</h3>
          <p className={'text-start'}>
            When even the smallest lesson brings a sense of victory, you will be more motivated to keep going.
          </p>
        </Col>
        <Col className="d-flex justify-content-end" xs={12} md={6} lg={6}>
          <img src={description3} className={styles.sub_image} />
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
