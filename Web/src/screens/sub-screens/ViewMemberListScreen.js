import { React, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Image, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SearchComponent from '../../components/SearchComponent';
import { deleteUser, editRole, getMemberClassByID, searchUser, resetMemberTab } from '../../redux/reducers/MemberSlice';
import { membersClassSelector } from '../../redux/selectors/Selectors';
import styles from '../../styles/screen-styles/ViewMemberListScreen.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import ConfirmDeleteComponent from '../../components/ConfirmDeleteComponent';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import classApi from '../../api/classApi';
import { classInfoSelector } from '../../redux/selectors/ClassInfoSelector';
import { UserClassRole } from '../../assets/TypeEnum';

const ViewMemberListScreen = () => {
  const members = useSelector(membersClassSelector);
  const classInfo = useSelector(classInfoSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classId } = useParams();
  const { currentUserRole = '' } = classInfo;

  const isOwner = currentUserRole === UserClassRole.OWNER;

  const [search, setSearch] = useState('');
  const [idDelete, setidDelete] = useState('');

  useEffect(() => {
    dispatch(searchUser(search));
  }, [search]);

  const [showDelete, setShowDelete] = useState(false);

  const getIdToDelete = (memberId) => {
    setidDelete(memberId);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      await classApi.deleteMember(classId, idDelete);
      dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG44 }));
      dispatch(setShow(true));
      dispatch(deleteUser(idDelete));
    } catch (error) {
      // let messageError = error.response.data.errors[0].message;
      // dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: messageError }));
    }
    setShowDelete(false);
  };

  const handleEditRole = async ({ memberId, role }) => {
    const data = { classId: classId, memberId: memberId, role: role };
    try {
      await classApi.editMemberRole(data);
    } catch (error) {
      let messageError = error.response.data.errors[0].message;
      dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: messageError }));
      dispatch(setShow(true));
    }
    dispatch(editRole({ id: memberId, role: role }));
  };

  const handleClose = () => {
    setShowDelete(false);
  };

  useEffect(() => {
    dispatch(getMemberClassByID(classId));
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetMemberTab());
  }, []);

  const editRoleHandle = (id, role) => {
    dispatch(editRole({ id, role }));
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs={1} md={6} lg={6}></Col>
        <Col xs={10} md={6} lg={6} className="p-0">
          <SearchComponent setSearch={setSearch} />
        </Col>
      </Row>

      <Row className={`m-0 mt-5 ${styles.user_card}`}>
        <Col xs={6} md={6} lg={7}>
          <p className={` mb-1 big-font text-start ${styles.text_theme}`}>Username</p>
        </Col>
        <Col xs={6} md={5} lg={3}>
          <Row>
            <Col xs={12} md={6} lg={6} className="d-none d-lg-block d-md-block">
              <p className={`mb-1 big-font text-center ${styles.text_theme}`}>Access Day</p>
            </Col>
            <Col xs={0} md={6} lg={6}>
              <p className={`mb-1 big-font text-center ${styles.text_theme}`}>Permission</p>
            </Col>
          </Row>
        </Col>
      </Row>

      {members.map((item, index) => {
        return (
          <Row key={index} className={`mt-4 m-0 pb-4 d-flex align-items-center ${styles.user_card}`}>
            <Col xs={7} md={6} lg={7} className="ps-0">
              <Row className="m-0">
                <Col xs={4} md={2} lg={2} className="d-flex align-items-center justify-content-center p-1">
                  <Image
                    src={item.avatarUrl}
                    alt="user image"
                    roundedCircle={true}
                    className={'my-auto'}
                    width={50}
                    height={50}
                  />
                </Col>
                <Col xs={8} lg={10} className="text-start ps-0 my-auto">
                  <Row>
                    <Col lg={10}>
                      <p className={`fw-bolder my-auto ${styles.short_text}`}>{item.name}</p>
                      <p className={`blur-text-color my-auto ${styles.word_wrap_break}`}>{item.email}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xs={4} md={5} lg={3} className="my-auto p-0">
              <Row className="m-0">
                <Col xs={12} md={6} lg={6} className={`my-auto ${styles.access_day}`}>
                  <p className={'mb-0'}>{item.accessDay}</p>
                </Col>
                <Col xs={12} md={6} lg={6} className="my-auto">
                  {isOwner && item.role !== UserClassRole.OWNER ? (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="none"
                        className={`p-0 ${styles.dropdown_toggle} ${styles.btn}`}
                        id="dropdown-menu-align-end"
                      >
                        {item.role} <i className={`fas fa-angle-down ${styles.angle_down_icon}`}></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu align="end" className={`${styles.no_padding}`}>
                        <Dropdown.Item
                          className={`${styles.dropdown_item}`}
                          onClick={() => {
                            handleEditRole({ memberId: item.id, role: UserClassRole.VIEWER });
                          }}
                        >
                          Viewer
                        </Dropdown.Item>
                        <Dropdown.Item
                          className={`${styles.dropdown_item}`}
                          onClick={() => {
                            handleEditRole({ memberId: item.id, role: UserClassRole.EDITOR });
                          }}
                        >
                          Editor
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    item.role
                  )}
                </Col>
              </Row>
            </Col>
            {isOwner && item.role !== UserClassRole.OWNER ? (
              <Col xs={1} className="p-0">
                <Button
                  className={`text-center p-0 far fa-trash-alt theme-text-color ${styles.trash_icon}`}
                  variant="outline-danger"
                  onClick={() => getIdToDelete(item.id)}
                />
              </Col>
            ) : null}
            <ConfirmDeleteComponent
              content={`Do you want to delete ${item.name} `}
              show={showDelete}
              handleClose={handleClose}
              handleDelete={handleDelete}
            />
          </Row>
        );
      })}
    </Container>
  );
};

export default ViewMemberListScreen;
