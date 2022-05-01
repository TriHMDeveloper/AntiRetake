import { useEffect, useState } from 'react';
import dataApi from './api/apiDemo';

function ProductList() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const params = {
          _page: 1,
          _limit: 10,
        };
        const response = await dataApi.getAll(params);
        setProductList(response.data);
      } catch (error) {
        console.log('Fail to fetch: ', error);
      }
    };
    fetchProductList();
  }, []);
}
