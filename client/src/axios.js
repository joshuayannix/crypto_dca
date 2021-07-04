import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:7000',
// })

const instance = axios.create({
  baseURL: "https://crypto-dca-backend.herokuapp.com",
});

export default instance;