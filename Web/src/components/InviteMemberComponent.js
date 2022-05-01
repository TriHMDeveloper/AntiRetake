import React, { useEffect, useState } from 'react';
import styles from '../styles/component-styles/InviteMember.module.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Modal, Button, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { usersToInviteSelector, isUsersLoadingSelector } from '../redux/selectors/ClassInfoSelector';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersToInvite } from '../redux/reducers/CreateClassSlice';
import { inviteMember } from '../redux/reducers/CreateClassSlice';
import { setShow, updateToastInfo } from '../redux/reducers/ToastSlice';
import { ToastType } from '../assets/TypeEnum';
import { Messages } from '../assets/Messages';

const InviteMemberComponent = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { classId } = useParams();

  const [selectedOptions, setSelectedOptions] = useState();
  const [searchText, setSearchText] = useState('');

  const usersToInvite = useSelector(usersToInviteSelector);
  const isUsersLoading = useSelector(isUsersLoadingSelector);

  const handleInput = (event, value) => setSearchText(value);
  const handleChange = (event, value) => setSelectedOptions(value);

  const handleInvite = async () => {
    await dispatch(inviteMember({ classId, memberList: selectedOptions.map((item) => item.id) }))
      .unwrap()
      .then((originalPromiseResult) => {
        dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG53 }));
        dispatch(setShow(true));
      });
    handleClose();
  };

  useEffect(() => {
    dispatch(getUsersToInvite({ searchText, classId }));
  }, [searchText]);

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.container_modal}
        contentClassName={styles.content_modal}
        centered
      >
        <Modal.Dialog className={styles.modal_dialog} contentClassName={styles.content_modal}>
          <Modal.Header closeButton className={`pe-3 ${styles.modal_header}`}>
            <p className={`my-auto theme-text-color huge-font ms-3 ${styles.header_text}`}>Invite member to class</p>
          </Modal.Header>
          <Modal.Body className={`mb-4 mt-2 ${styles.modal_body}`}>
            <p className={`text-start ${styles.tutorial}`}>
              To invite members to this class, please enter their email below.
            </p>
            <Row className="m-0">
              <Col xs={8} md={9} lg={10} className="ps-0 pe-0">
                <Autocomplete
                  multiple
                  autoHighlight
                  filterSelectedOptions
                  size="small"
                  onChange={handleChange}
                  value={selectedOptions}
                  loading={isUsersLoading}
                  options={usersToInvite}
                  onInputChange={handleInput}
                  getOptionLabel={(option) => option.email}
                  renderOption={(props, option) => {
                    const { email, username } = option;
                    return (
                      <div {...props} className="d-flex justify-content-between">
                        <p className="ms-2">{email}</p>
                        <p className="me-2 blur-text-color">{username}</p>
                      </div>
                    );
                  }}
                  renderInput={(params) => <TextField {...params} label="Enter email" size="small" />}
                />
              </Col>
              <Col xs={4} md={3} lg={2} className="d-flex align-items-center justify-content-end pe-0">
                <Button className={'accept-button me-0'} onClick={handleInvite}>
                  Invite
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    </div>
  );
};
export default InviteMemberComponent;
