import { React, useEffect, useState } from 'react';
import styles from '../styles/component-styles/FolderCardStyle.module.css';
import { selectFolders } from '../redux/reducers/AddFolderToClassSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { UserClassRole } from '../assets/TypeEnum';
import { classInfoSelector } from '../redux/selectors/ClassInfoSelector';
import { selectedFolderSelector } from '../redux/selectors/Selectors';
import ConfirmDeleteComponent from './ConfirmDeleteComponent';
import { Messages } from '../assets/Messages';
import { resetToggle } from '../redux/reducers/ViewFolderCardSlice';

const FolderCardComponent = ({ flashInfo, selectable, removable, setFolderDelete, handleShowDelete }) => {
  const { name, numOfSets, id } = flashInfo;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const classInfo = useSelector(classInfoSelector);

  const selectedFolder = useSelector(selectedFolderSelector);
  const [isClicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(selectedFolder === id);
  }, [selectedFolder]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {name}
    </Tooltip>
  );

  const handleRemove = (e) => {
    e.stopPropagation();
    setFolderDelete({ id: id, name: name });
    handleShowDelete();
  };

  return (
    <OverlayTrigger placement="top" delay={{ show: 100, hide: 100 }} overlay={renderTooltip}>
      <div
        className={`shadow-box white-background-color-clickable p-2 text-start noselect ${
          isClicked ? `${styles.clicked_card}` : null
        }`}
        onClick={() => {
          //TODO: check onClick ViewFolderListScreen
          if (selectable) {
            dispatch(selectFolders({ id }));
          } else {
            navigate(`/folders/${id}`);
          }
        }}
      >
        {removable && classInfo.currentUserRole === UserClassRole.OWNER ? (
          <>
            <Dropdown>
              <Dropdown.Toggle
                variant="none"
                onClick={handleRemove}
                className={`${styles.dropdown_toggle} ${styles.btn}`}
                id="dropdown-menu-align-end"
              >
                <i className={`fas fa-times blur-text-color ${styles.remove_icon}`}></i>
              </Dropdown.Toggle>
            </Dropdown>
          </>
        ) : (
          <></>
        )}

        <Row className="m-0">
          <Col xs={0} md={0} lg={1} />
          <Col xs={12} md={12} lg={11} className="d-flex align-items-center justify-content-start">
            <div className={`${isClicked ? 'white-text-color' : 'blur-text-color'}`}>{numOfSets}</div>
          </Col>
        </Row>

        <Row className={`m-0 ${styles.folder_name}`}>
          <Col xs={0} md={0} lg={1} />
          <Col
            xs={0}
            md={3}
            lg={2}
            className={`d-flex align-items-center d-none d-lg-block d-md-block ${styles.folder_name}`}
          >
            <i
              className={`far fa-folder ${styles.icon_folder} ${isClicked ? 'white-text-color' : styles.theme_color}`}
            />
          </Col>
          <Col xs={12} md={9} lg={9} className={`d-flex align-items-center ${styles.folder_name}`}>
            <div
              className={`huge-font ${styles.word_wrap_break} ${isClicked ? 'white-text-color' : styles.theme_color}`}
            >
              {name}
            </div>
          </Col>
        </Row>
      </div>
    </OverlayTrigger>
  );
};

export default FolderCardComponent;
