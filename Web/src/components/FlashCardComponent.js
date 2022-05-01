import React, { useRef } from 'react';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import styles from '../styles/component-styles/FlashCard.module.css';

const FlashCardComponent = ({ flashCard }) => {
  const { id, term, definition, index } = flashCard;
  const flip = useRef();

  return (
    <div key={id}>
      <Flippy flipOnHover={false} flipOnClick={true} flipDirection="vertical" ref={flip} className={styles.flip_card}>
        <FrontSide className="white-background-color d-flex align-items-center justify-content-center paragraphs">
          {term}
        </FrontSide>
        <BackSide className="white-background-color d-flex align-items-center justify-content-center paragraphs">
          {definition}
        </BackSide>
      </Flippy>
    </div>
  );
};

export default FlashCardComponent;
