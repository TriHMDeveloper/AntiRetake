import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
    // Default transform is "translate(14px, 20px) scale(1)""
    // This lines up the label with the initial cursor position in the input
    // after changing its padding-left.
    transform: 'translate(20px, 14px) scale(1);',
    color: '#252525',
  },
  // "& .MuiOutlinedInput-root": {
  //     color: "#252525",
  //     // padding: 13.5,
  //     // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
  //     '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-of-type': {
  //         // Default left padding is 6px
  //         paddingLeft: 26
  //     },
  //     "& .MuiOutlinedInput-notchedOutline": {
  //         letterSpacing: 3
  //     }
  // },
  '& .MuiOutlinedInput-input': {
    padding: 13.5,
  },
});

const SearchComponent = ({ setSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      // Send Axios request here
      setSearch(searchValue);
    }, 500);
    return () => {
      clearTimeout(delaySearch);
    };
  }, [searchValue]);

  return (
    <div className="mt-2">
      <StyledTextField
        fullWidth
        size="small"
        id="outlined-basic"
        label="Search"
        variant="outlined"
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

export default SearchComponent;
