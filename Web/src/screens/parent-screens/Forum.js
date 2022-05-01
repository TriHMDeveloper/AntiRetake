import TextField from '@mui/material/TextField';
import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from '../../styles/component-styles/QuestionCardComponent-style.module.css';
import ViewQuestionListOfSearchScreen from '../sub-screens/ViewQuestionListOfSearchScreen';

const Forum = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/forum/create-question');
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('name');
  const [searchText, setSearchText] = useState(search);
  let textInput = useRef(null);

  const handleSearch = (event) => {
    if (searchText !== '') {
      if (event.key === 'Enter') {
        setSearchParams({ name: searchText, page: 1 });
        textInput.current.blur();
        event.preventDefault();
      }
    }
  };

  return (
    <Container className="mb-5">
      <Row className="mb-4 mt-5 mx-4 px-1" md="auto" xs="auto">
        <Col className="text-start">
          <i className={` fas fa-comments fa-3x ${styles.color_button}`}></i>
        </Col>
        <Col className="text-start my-auto">
          <h2 className="my-0">Forum</h2>
        </Col>
      </Row>
      <Row className="mt-5 mb-2 mx-4 px-1">
        <Col xs={12} md={6} className="text-start my-2">
          <Button className={`${styles.btn_color} py-2 px-4`} type="submit" variant="success" onClick={handleClick}>
            Ask question
          </Button>
        </Col>
        <Col xs={12} md={6} className="my-2">
          <TextField
            fullWidth
            size="small"
            inputRef={textInput}
            defaultValue={search}
            onChange={(e, value) => {
              setSearchText(e.target.value);
            }}
            onKeyPress={handleSearch}
            label="Search"
            id="outlined-basic"
            variant="outlined"
          />
        </Col>
      </Row>
      <Col className="mx-3">
        <ViewQuestionListOfSearchScreen />
      </Col>
    </Container>
  );
};

export default Forum;
