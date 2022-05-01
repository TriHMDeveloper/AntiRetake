import { React, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFlashcardByID, newCard, newFlashCardContainer } from '../redux/reducers/CreateFlashcardSlice';
import { flashcardContainerSelector } from '../redux/selectors/Selectors';
import CreateStudySetCardComponent from './CreateStudySetCardComponent';
import { useParams } from 'react-router-dom';

const FlashcardContainerComponent = () => {
  const flashcardContainer = useSelector(flashcardContainerSelector);
  const { studySetId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!studySetId) {
      dispatch(newFlashCardContainer());
    } else {
      const data = { id: studySetId, limit: 0 };
      dispatch(getAllFlashcardByID(data));
    }
  }, [studySetId]);

  return (
    <div id="flashcard-container">
      {flashcardContainer.map((item, index) => {
        return (
          <div key={item.id}>
            <CreateStudySetCardComponent flashcard={item} i={index} />
          </div>
        );
      })}
      <div className="d-flex justify-content-end ">
        <Button
          className="decline-button mb-2"
          variant="outline-dark"
          onClick={() => {
            dispatch(newCard());
          }}
        >
          New Card
        </Button>
      </div>
    </div>
  );
};

export default FlashcardContainerComponent;
