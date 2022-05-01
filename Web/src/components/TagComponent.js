import React from 'react';

const TagComponent = ({ name, type }) => {
  var colorType = '';
  if (type === 'subject') {
    colorType = 'subject-color';
  } else if (type === 'textbook') {
    colorType = 'textbook-color';
  } else {
    colorType = 'school-color';
  }

  return <div className={` my-2 ${colorType} text-center tag-style noselect`}>{name}</div>;
};

export default TagComponent;
