import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { TabBarType } from '../../assets/TypeEnum';
import TabBarComponent from '../../components/TabBarComponent';
import ViewClassListOfSearchScreen from '../sub-screens/ViewClassListOfSearchScreen';
import ViewQuestionListOfSearchScreen from '../sub-screens/ViewQuestionListOfSearchScreen';
import ViewStudySetListOfSearchScreen from '../sub-screens/ViewStudySetListOfSearchScreen';
import ViewUserListOfSearchScreen from '../sub-screens/ViewUserListOfSearchScreen';

const searchIcon = <i className="fas fa-search theme-text-color fa-lg"></i>;
const clear = <i className="fas fa-times-circle theme-text-color fa-lg clickable"></i>;
const SearchScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('name');
  const [searchText, setSearchText] = useState(search);
  let textInput = useRef(null);

  useEffect(() => {
    textInput.current.value = search;
  }, [search]);

  const handleClearSearch = () => {
    setSearchText('');
    textInput.current.value = '';
  };

  const handleSearch = (event) => {
    if (searchText !== '') {
      if (event.key === 'Enter') {
        setSearchParams({ name: searchText, page: 1 });
        textInput.current.blur();
        event.preventDefault();
      }
    }
  };

  return (
    <Container>
      <TextField
        fullWidth
        className="w-75 my-5"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start" onClick={handleClearSearch}>
              {searchText !== '' ? clear : null}
            </InputAdornment>
          ),
          startAdornment: <InputAdornment position="start">{searchIcon}</InputAdornment>,
          style: { fontSize: 20 },
        }}
        InputLabelProps={{ shrink: false }}
        inputRef={textInput}
        defaultValue={search}
        onChange={(e, value) => {
          setSearchText(e.target.value);
        }}
        onKeyPress={handleSearch}
        label=""
        id="outlined-basic"
        variant="outlined"
      />

      <TabBarComponent tabType={TabBarType.SEARCH} />
      <Routes>
        <Route index path="sets" element={<ViewStudySetListOfSearchScreen />} />
        <Route path="classes" element={<ViewClassListOfSearchScreen />} />
        <Route path="users" element={<ViewUserListOfSearchScreen />} />
        <Route path="questions" element={<ViewQuestionListOfSearchScreen />} />
      </Routes>
    </Container>
  );
};

export default SearchScreen;
