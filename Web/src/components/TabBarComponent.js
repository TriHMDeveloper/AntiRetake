import React from 'react';
import styles from '../styles/component-styles/TabBar.module.css';
import { Row, Col } from 'react-bootstrap';
import { TabBarType } from '../assets/TypeEnum';

import { Link, useLocation, useSearchParams } from 'react-router-dom';

const TabBarComponent = ({ tabType, param }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  let search = '';
  if (searchParams.get('name')) {
    search = searchParams.get('name');
  }

  const renderSearchTabBar = tabType.map((tab) => {
    return (
      <Col key={tab.href()} xs={12 / tabType.length} md={2} lg="auto" className="px-0">
        <Link
          to={{ pathname: tab.href(), search: `?name=${search}&page=1` }}
          className={`${styles.tab}
        ${location.pathname === tab.href() ? styles.tab_active : ''} px-4`}
          replace
        >
          {tab.name}
        </Link>
      </Col>
    );
  });

  const renderTabBar = tabType.map((tab) => {
    return (
      <Col key={tab.href()} xs={12 / tabType.length} md={2} lg="auto" className="px-0">
        <Link
          to={{ pathname: tab.href(param) }}
          className={`${styles.tab}
        ${location.pathname === tab.href(param) ? styles.tab_active : ''} px-4`}
          replace
        >
          {tab.name}
        </Link>
      </Col>
    );
  });

  return (
    <Row className={`${styles.tab_group} mb-4`}>
      {/* {renderSearchTabBar} */}
      {JSON.stringify(tabType) === JSON.stringify(TabBarType.SEARCH) ? renderSearchTabBar : renderTabBar}
    </Row>
  );
};

export default TabBarComponent;
