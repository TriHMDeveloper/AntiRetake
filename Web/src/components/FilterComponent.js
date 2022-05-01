import React, { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { Row, Col } from 'react-bootstrap';
import { TagType } from '../assets/TypeEnum';

import { useSelector, useDispatch } from 'react-redux';
import { filterTagSelector, isLoadingfilterTagSelector } from '../redux/selectors/FilterTagSelector';
import { getFilterTag } from '../redux/reducers/FilterTagSlice';

const StyledAutocomplete = styled(Autocomplete)({
  '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
    // Default transform is "translate(14px, 20px) scale(1)""
    // This lines up the label with the initial cursor position in the input
    // after changing its padding-left.
    transform: 'translate(20px, 14px) scale(1);',
    color: '#252525',
  },
  '& .MuiAutocomplete-inputRoot': {
    color: '#252525',
    padding: 6,
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-of-type': {
      // Default left padding is 6px
      paddingLeft: 26,
    },
  },
});

const FilterComponent = ({ type, setFilter, filter, isForum }) => {
  const filterTagList = useSelector(filterTagSelector);
  const isLoading = useSelector(isLoadingfilterTagSelector);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  const splitCurrentTags = (currentTags) => {
    let subject = [];
    let textbook = [];
    let school = [];
    if (currentTags) {
      currentTags.map((tag) => {
        if (tag.type === TagType.TEXTBOOK) {
          textbook.push(tag.id);
        }
        if (tag.type === TagType.SUBJECT) {
          subject.push(tag.id);
        }
        if (tag.type === TagType.SCHOOL) {
          school.push(tag.id);
        }
      });
    }
    return { subject: subject, textbook: textbook, school: school };
  };

  useEffect(() => {
    let currentTagList = splitCurrentTags(filter);
    const delaySearch = setTimeout(() => {
      dispatch(
        getFilterTag({
          subject: currentTagList.subject,
          textbook: currentTagList.textbook,
          school: currentTagList.school,
          tagTypeList: type,
          searchText: searchText,
        })
      );
    }, 500);
    return () => {
      clearTimeout(delaySearch);
    };
  }, [searchText]);

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (currentTags) {
  //       setFilter(filterCurrentTags);
  //     }
  //   }
  // }, [isLoading]);

  const handleChange = (event, value) => {
    setFilter(value);
  };

  const handleInputChange = (event, value) => {
    setSearchText(value);
  };

  return (
    <div className="mt-2">
      <StyledAutocomplete
        multiple
        filterSelectedOptions
        id="tags-standard"
        options={filterTagList}
        loading={isLoading}
        value={filter}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={handleChange}
        onInputChange={handleInputChange}
        renderOption={(props, option) => (
          <Row {...props} style={{ marginRight: '0px', marginLeft: '0px' }} key={option.id}>
            <Col className="text-start">{option.name}</Col>
            <Col className="text-end blur-text-color">{option.type}</Col>
          </Row>
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            if (option.type === TagType.SUBJECT) {
              return (
                <Chip
                  key={option.id}
                  style={{ backgroundColor: '#00645A', borderRadius: '4px' }}
                  color="success"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              );
            }
            if (option.type === TagType.TEXTBOOK) {
              return (
                <Chip
                  key={option.id}
                  style={{ backgroundColor: '#4D77B8', borderRadius: '4px' }}
                  color="success"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              );
            }
            if (option.type === TagType.SCHOOL) {
              return (
                <Chip
                  key={option.id}
                  style={{ backgroundColor: '#7E7199', borderRadius: '4px' }}
                  color="success"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              );
            }
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={isForum ? 'tags' : 'Filter'}
            // variant="standard"
            placeholder="Tags"
          />
        )}
      />
    </div>
  );
};

export default FilterComponent;
