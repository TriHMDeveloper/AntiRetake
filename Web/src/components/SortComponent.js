import React, { useState } from 'react';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

const member = <i className="fas fa-user theme-text-color me-1"></i>;

const StyledFormControl = styled(FormControl)({
  '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
    // Default transform is "translate(14px, 20px) scale(1)""
    // This lines up the label with the initial cursor position in the input
    // after changing its padding-left.
    transform: 'translate(20px, 14px) scale(1);',
    color: '#252525',
  },
  '& .MuiOutlinedInput-root': {
    color: '#252525',
    // padding: 13.5,
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-of-type': {
      // Default left padding is 6px
      paddingLeft: 26,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      letterSpacing: 3,
    },
  },
  '& .MuiSelect-select': {
    padding: 13.5,
  },
});

const SortComponent = ({ listItemSort, setSortBy }) => {
  const [type, setType] = useState(listItemSort[0].value);

  const handleChange = (event, value) => {
    setType(event.target.value);
    setSortBy(event.target.value);
  };

  return (
    <div className="mt-2">
      <StyledFormControl style={{ minWidth: 150 }}>
        <InputLabel id="demo-simple-select-label"> Sort By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          displayEmpty
          value={type}
          label="Type"
          onChange={handleChange}
        >
          {listItemSort.map((item) => {
            return (
              <MenuItem key={item.value} value={item.value}>
                {item.title}
              </MenuItem>
            );
          })}
        </Select>
      </StyledFormControl>
    </div>
  );
};

export default SortComponent;
