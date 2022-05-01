import { React, useEffect, useState } from 'react';
import styles from '../styles/component-styles/StudySetCardForSaveStyle.module.css';
import { selectStudyset } from '../redux/reducers/AddStudysetToClassSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { selectedStudysetSelector } from '../redux/selectors/Selectors';

const StudySetCardForSaveComponent = ({ studySet }) => {
  const { name, id } = studySet;
  const [isClicked, setClicked] = useState(false);
  const dispatch = useDispatch();

  const selectedStudyset = useSelector(selectedStudysetSelector);

  useEffect(() => {
    setClicked(selectedStudyset === id);
  }, [selectedStudyset]);

  return (
    <div
      className={`shadow-box white-background-color-clickable noselect text-start p-3 ${
        isClicked ? `${styles.clicked_card}` : null
      }`}
      onClick={() => {
        dispatch(selectStudyset({ id }));
      }}
      key={id}
    >
      <Row className="m-0">
        <Col xs={0} md={3} lg={2} className=" d-none d-lg-block d-md-block">
          <i className={`fas fa-clone ${styles.icon_clone} ${isClicked ? 'white-text-color' : styles.theme_color}`} />
        </Col>
        <Col xs={12} md={9} lg={10} className={`d-flex align-items-center ${styles.folder_name}`}>
          <div className={`huge-font ${styles.word_wrap_break} ${isClicked ? 'white-text-color' : styles.theme_color}`}>
            {name}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StudySetCardForSaveComponent;
