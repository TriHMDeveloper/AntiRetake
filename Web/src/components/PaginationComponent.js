import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';

const StyledPagination = styled(Pagination)({
  '& .MuiPaginationItem-root.Mui-selected': {
    backgroundColor: '#009387',
    color: '#fff',
  },
  '& .MuiPaginationItem-root:hover': {
    backgroundColor: '#51c4b7',
    color: '#fff',
  },
  '& .MuiPaginationItem-root.Mui-selected:hover': {
    backgroundColor: '#009387',
    color: '#fff',
  },
});

const PaginationComponent = ({ totalPage, page, setPageNums }) => {
  // const [currentPage, setCurrentPage] = useState(1)

  // useEffect(() => {

  // }, [page])

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePagination = (event, value) => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set('page', value);
    setSearchParams(updatedSearchParams.toString());

    // setPageNums(value)
  };

  return <StyledPagination count={totalPage} page={parseInt(page)} onChange={handlePagination} />;
};

export default PaginationComponent;
