import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmDeleteComponent = ({ content, show, handleClose, handleDelete }) => {
  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <div className=" d-flex justify-content-center">
            <i className="far fa-times-circle giant-font" style={{ color: 'red', fontSize: '50px' }} />
          </div>
          <h3 className="text-center">Are you sure?</h3>
          <div className="blur-text-color big-font pb-4 text-center mt-4">{content}</div>
          <div className="d-flex justify-content-center">
            <Button className="ps-3 pe-3 me-5" variant="outline-dark" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="ps-3 pe-3 ms-5" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ConfirmDeleteComponent;
