import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../styles/component-styles/CarouselStudySetCard.module.css';
import StudySetCardComponent from './StudySetCardComponent';

const StudySetCardCarouselComponent = ({ homepageCards }) => {
  const sliderRef = useRef();
  // const homepageCards = useSelector(homepageCardSelector)
  // const dispatch = useDispatch()
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //     dispatch(getHomepageCard())
  // }, [dispatch])

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        onClick={onClick}
        className={`${styles.slick_next_custom}
             ${onClick === null ? styles.disable_arrow : ''} slick-arrow`}
      >
        <i className="fas fa-chevron-right fa-2x"></i>
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        onClick={onClick}
        className={`${styles.slick_prev_custom}
             ${onClick === null ? styles.disable_arrow : ''} slick-arrow`}
      >
        <i className="fas fa-chevron-left fa-2x"></i>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (current, next) => setCurrentIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          centerMode: true,
          arrows: false,
        },
      },
    ],
  };

  const renderStudySetData = homepageCards.map((studySet) => {
    return (
      <div className="p-2" key={studySet.id}>
        <StudySetCardComponent studySet={studySet} />
      </div>
    );
  });

  return (
    <div className={`${styles.slick_container}`}>
      <Slider ref={sliderRef} {...settings}>
        {renderStudySetData}
      </Slider>
    </div>
  );
};

export default StudySetCardCarouselComponent;
