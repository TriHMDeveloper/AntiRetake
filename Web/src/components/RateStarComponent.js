import { React, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '../styles/component-styles/RateStarStyle.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { ToastType } from '../assets/TypeEnum';
import { getStudySetInfo } from '../redux/reducers/StudySetSlice';
import { Messages } from '../assets/Messages';
import { updateToastInfo, setShow } from '../redux/reducers/ToastSlice';
import studySetApi from '../api/studySetApi';

const RateStarComponent = ({ show, handleClose, chosenStar, studySetId }) => {
  const dispatch = useDispatch();
  const starValue = [
    { click: ' ', hover: ' ', title: 'Bad', value: 1 },
    { click: ' ', hover: ' ', title: 'Fair', value: 2 },
    { click: ' ', hover: ' ', title: 'Good', value: 3 },
    { click: ' ', hover: ' ', title: 'Excellent', value: 4 },
    { click: ' ', hover: ' ', title: 'WOW!!!', value: 5 },
  ];
  const [star, setStar] = useState(starValue);
  const [hovered, setHovered] = useState(false);
  const [chosenStarState, setChosenStarState] = useState(chosenStar);
  const [rating, setRating] = useState(false);

  const changeHoverClass = (index, className) => {
    for (let i = 0; i < starValue.length; i++) {
      if (starValue[i].value <= index) {
        star[i].hover = className;
      }
    }
    setHovered(!hovered);
  };

  const mouseoverStar = (index) => {
    changeHoverClass(index, styles.icon_hovered);
  };

  const mouseleaveStar = (index) => {
    changeHoverClass(index, styles.icon_unhover);
  };

  const clickStar = (index) => {
    for (let i = 0; i < starValue.length; i++) {
      if (starValue[i].value <= index) {
        star[i].click = styles.icon_clicked;
      } else {
        star[i].click = ' ';
      }
    }
    setChosenStarState(index);
    setHovered(!hovered);
  };

  const handleRate = async () => {
    setRating(true);

    try {
      const response = await studySetApi.rateStudySet({ rate: chosenStarState, id: studySetId });
      await dispatch(getStudySetInfo(studySetId));
      dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG33 }));
      dispatch(setShow(true));
      setRating(false);
      handleClose();
    } catch (error) {
      setRating(false);
      handleClose();
      console.log('Fail to fetch: ', error);
    }
  };

  useEffect(() => {
    clickStar(chosenStar);
  }, [star]);

  return (
    <div>
      <Modal show={show} onHide={handleClose} contentClassName={styles.modal_content}>
        <Modal.Header closeButton className={`pe-3 ${styles.vote_head}`}>
          <h4 className={`my-auto ms-1 text-center ${styles.header_text}`}>Give your rates for this study set</h4>
        </Modal.Header>

        <Modal.Body className={'p-2 mb-2'}>
          <p className="mb-2 mt-2 pb-1 text-center theme-text-color">CHOOSE STARS</p>
          <div className={`mb-4 ${styles.star_rating}`}>
            {star.map((item, index) => {
              return (
                <div className="d-flex align-items-center ms-1 me-1" key={item.value}>
                  <i
                    className={`fas fa-star ${item.click} ${item.hover}`}
                    title={item.title}
                    value={index + 1}
                    onMouseEnter={() => mouseoverStar(index + 1)}
                    onMouseLeave={() => mouseleaveStar(index + 1)}
                    onClick={() => clickStar(index + 1)}
                  />
                </div>
              );
            })}
          </div>
          {/* TODO: Call Vote API */}
          <div className="d-flex align-items-center mb-2">
            <Button
              className={'accept-button mx-auto'}
              disabled={chosenStarState === 0 || rating}
              onClick={() => {
                handleRate();
              }}
            >
              Vote
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RateStarComponent;
