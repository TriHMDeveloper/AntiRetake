import React, { useEffect, useState, useRef, useMemo } from 'react';
import styles from '../styles/component-styles/TitleBarUser.module.css';
import { NavDropdown, Container, FormControl, Form, Navbar, Nav, Dropdown, Button, Col, Image } from 'react-bootstrap';
import {
  getCurrentUserInfo,
  resetUser,
  getNotification,
  readAllNotification,
} from '../redux/reducers/CurrentUserInfoSlice';
import {
  currentUserInfoSelector,
  notificationSelector,
  isLoadingNotificationSelector,
} from '../redux/selectors/CurrentUserInfo';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenLink } from '../assets/TypeEnum';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';
import { resetHomepage } from '../redux/reducers/HomepageCardSlice';
import NotificationCardComponent from '../components/NotificationCardComponent';
import { CircularProgress } from '@mui/material';

const LIMIT = 5;

const checkChangePassword = () => {
  const currentUser = auth.currentUser;
  const checkPasswordProvider = currentUser.providerData.find((provider) => provider.providerId === 'password');
  return checkPasswordProvider;
};
const logo = require('../assets/images/logoAntiRetake.png');

const TitleBarUser = () => {
  const userInfo = useSelector(currentUserInfoSelector);
  const notification = useSelector(notificationSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoadingNotification = useSelector(isLoadingNotificationSelector);
  const [searchText, setSearchText] = useState('');
  let searchInput = useRef(null);
  const [limitCount, setLimit] = useState(1);

  useEffect(() => {
    dispatch(getNotification({ limit: limitCount * LIMIT }));
    const delayGetNotification = setInterval(() => {
      dispatch(getNotification({ limit: limitCount * LIMIT }));
    }, 10000);
    return () => clearInterval(delayGetNotification);
  }, [limitCount]);

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

  const handleClickNoti = () => {
    setLimit(1);
    dispatch(readAllNotification());
    dispatch(getNotification({ limit: 1 * LIMIT }));
  };

  const handleGetNotification = () => {
    setLimit(limitCount + 1);
  };

  const renderNotification = notification.notificationList.map((noti, index) => {
    return (
      <Dropdown.Item key={index}>
        <NotificationCardComponent notification={noti} />
      </Dropdown.Item>
    );
  });

  const trackScrolling = () => {
    const wrappedElement = document.getElementById('scrollable');
    if ((wrappedElement.scrollHeight - wrappedElement.scrollTop - 0.5).toFixed() <= wrappedElement.clientHeight) {
      !notification.isEnd ? handleGetNotification() : null;
    }
  };

  return (
    <Navbar expand="md" className={`${styles.navbar}`}>
      <Container fluid>
        <Navbar.Brand className={`${styles.nav_brand}`}>
          <Image
            className={styles.logo}
            src={logo}
            width={80}
            height={40}
            referrerPolicy="no-referrer"
            onClick={() => navigate(ScreenLink.HOMEPAGE)}
          ></Image>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto my-2 my-lg-0 text-start">
            <Link to="/" className={`tab ${styles.tab} ${styles.tab_name} ms-3`}>
              Home
            </Link>
            <Link
              to={{ pathname: ScreenLink.FORUM, search: '?name=&page=1' }}
              className={`tab ${styles.tab} ${styles.tab_name} ms-3`}
            >
              Forum
            </Link>

            <NavDropdown title="Create" className={`${styles.tab} noselect ms-3 py-0`}>
              <NavDropdown.Item onClick={() => navigate(ScreenLink.CREATE_STUDY_SET)}>Study Set</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate(ScreenLink.CREATE_FOLDER)}>Folder</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate(ScreenLink.CREATE_CLASS)}>Class</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Col md={1} xs={0}></Col>
          <Col md={5} xs={12}>
            <Form className="d-flex ">
              <FormControl
                type="search"
                placeholder="Search"
                className={`${styles.search} me-3 `}
                aria-label="Search"
                onKeyPress={handleSearch}
                onChange={(e, value) => {
                  setSearchText(e.target.value);
                }}
                ref={searchInput}
              />

              <Dropdown className="p-0 m-0">
                <Dropdown.Toggle className={`icon_btn ${styles.icon_btn} ${styles.dropdown_toggle} py-0`}>
                  <div className={`rounded-circle ${styles.noti_button} icon-button d-flex`} onClick={handleClickNoti}>
                    <i className={'fas fa-bell fa-lg white-color m-auto'}></i>
                    {!notification.isReadAll ? (
                      <i className={`fas fa-circle white-color m-auto ${styles.dot}`}></i>
                    ) : null}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  align="end"
                  className={`${styles.dropdown_container}`}
                  id="scrollable"
                  onScroll={trackScrolling}
                >
                  {notification.notificationList.length === 0 ? (
                    <p className="text-center m-0">No Notification</p>
                  ) : null}
                  {renderNotification}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className="p-0 m-0">
                <Dropdown.Toggle className={`icon_btn ${styles.icon_btn} py-0`}>
                  <Image
                    src={userInfo.avatarUrl}
                    roundedCircle="true"
                    width={40}
                    height={40}
                    referrerPolicy="no-referrer"
                  ></Image>
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={() => navigate(`/users/${userInfo.id}`)}>Profile</Dropdown.Item>
                  {checkChangePassword() && (
                    <Dropdown.Item onClick={() => navigate(ScreenLink.CHANGE_PASSWORD)}>Change Password</Dropdown.Item>
                  )}
                  <Dropdown.Item
                    onClick={async () => {
                      try {
                        await auth.signOut();
                        dispatch(resetUser());
                        navigate(ScreenLink.LANDING);
                        dispatch(resetHomepage());
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form>
          </Col>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TitleBarUser;
