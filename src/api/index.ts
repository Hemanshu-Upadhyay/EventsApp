import axios from 'axios';

const makeRequest = (
  url: string,
  method = 'GET',
  body = {},
  // options: Object,
) => {
  // const allOptions = {
  //   headers: {...options},
  // };
  switch (method) {
    case 'GET':
      return axios.get(url);

    case 'POST':
      return axios.post(url, body);

    case 'PUT':
      return axios.put(url, body);

    case 'PATCH':
      return axios.patch(url, body);

    case 'DELETE':
      return axios.delete(url);

    default:
      return axios.get(url, {});
  }
};

export default makeRequest;
