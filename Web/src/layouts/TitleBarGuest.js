import React, { useState, useRef } from 'react';
import { Button, Container, Form, FormControl, Nav, Navbar, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/component-styles/TitleBarGuest.module.css';
import { ScreenLink } from '../assets/TypeEnum';
const logo = require('../assets/images/logoAntiRetake.png');

const TitleBarGuest = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  let searchInput = useRef(null);

  const handleSearch = (event) => {
    if (searchText !== '') {
      if (event.key === 'Enter') {
        searchInput.current.blur();
        navigate({
          pathname: '/search/sets',
          search: `?name=${searchText}&page=1`,
        });
        searchInput.current.value = '';
        setSearchText('');
        event.preventDefault();
      }
    } else {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    }
  };

  return (
    <Navbar expand="md" className={`${styles.navbar}`}>
      <Container fluid>
        <Navbar.Brand className={`nav_brand ${styles.nav_brand}`}>
          <Image
            className={styles.logo}
            src={logo}
            width={80}
            height={40}
            referrerPolicy="no-referrer"
            onClick={() => navigate(ScreenLink.LANDING)}
          ></Image>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto my-2 my-lg-0 text-start">
            <Link to="/" className={`tab ${styles.tab} ${styles.tab_name} ms-3`}>
              Home
            </Link>
            <Link
              to={{ pathname: '/Forum', search: '?name=&page=1' }}
              className={`tab ${styles.tab} ${styles.tab_name} ms-3`}
            >
              Forum
            </Link>
            <Link to="/Sign-in" className={`tab ${styles.tab} ${styles.tab_name} ms-3`}>
              Create
            </Link>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className={`${styles.search} me-4`}
              aria-label="Search"
              onKeyPress={handleSearch}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              ref={searchInput}
            />
            {/* <Button className={`${styles.signin} me-4 `} onClick={() => navigate(ScreenLink.SIGN_IN)}>
              Sign In
            </Button>
            <Button className={`${styles.signup} me-4 `} onClick={() => navigate(ScreenLink.SIGN_UP)}>
              Sign Up
            </Button> */}
            <Button className={`${styles.signin} me-2`} onClick={() => navigate(ScreenLink.SIGN_IN)}>
              Sign in
            </Button>
            <Button className={`${styles.signup}`} onClick={() => navigate(ScreenLink.SIGN_UP)}>
              Sign up
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TitleBarGuest;
