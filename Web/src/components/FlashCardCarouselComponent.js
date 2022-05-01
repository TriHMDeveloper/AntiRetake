import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../styles/component-styles/CarouselFlashCard.module.css';
import FlashCardComponent from './FlashCardComponent';
import { Row, Col } from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';
import { flashcardSelector } from '../redux/selectors/StudySetSelector';

const StudySetCardCarouselComponent = ({ updateCard, totalCard }) => {
  const sliderRef = useRef();
  const dispatch = useDispatch();
  const flashcardList = useSelector(flashcardSelector);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === flashcardList.length - 1) {
      updateCard();
    }
  }, [currentIndex]);

  const Previous = () => {
    sliderRef.current.slickPrev();
  };

  const Next = () => {
    sliderRef.current.slickNext();
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setCurrentIndex(next),
  };

  const renderFlashCardData = flashcardList.map((flashCard) => {
    return (
      <div className="px-5 py-2" key={flashCard.id}>
        <FlashCardComponent flashCard={flashCard} />
      </div>
    );
  });

  return (
    <div className={styles.slick_container}>
      <Slider ref={sliderRef} {...settings}>
        {renderFlashCardData}
      </Slider>
      <Row>
        <Col>
          <i
            className={`fas fa-chevron-left ${currentIndex === 0 ? styles.disable_arrow : styles.prev_arrow}`}
            onClick={Previous}
          ></i>
          <span className="mx-4 noselect">
            {currentIndex + 1}/{totalCard}
          </span>
          <i
            className={`fas fa-chevron-right ${
              currentIndex === totalCard - 1 ? styles.disable_arrow : styles.next_arrow
            }`}
            onClick={Next}
          ></i>
        </Col>
      </Row>
    </div>
  );
};

export default StudySetCardCarouselComponent;
