import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { MultiCardSelector } from '../redux/selectors/Selectors';
import styles from '../styles/component-styles/MultichoiceCard.module.css';
const MultichoiceCard = ({ showAnswer }) => {
  const questions = useSelector(MultiCardSelector);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect === true) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className={`${styles.app}`}>
      {showScore ? (
        <div className={`${styles.score_section}`}>
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className={styles.question_section}>
            <div className={`${styles.question}`}>Definition</div>
            <div className={`${styles.question_text}`}>{questions.content}</div>
          </div>
          <div className={`${styles.answer}`}>Term</div>
          <div className={`${styles.answer_section}`}>
            {questions.answer.map((answerOption) => (
              <button
                key={answerOption.content}
                onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
                className={`${styles.SingleOption} white-background-color`}
              >
                {answerOption.content}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MultichoiceCard;
