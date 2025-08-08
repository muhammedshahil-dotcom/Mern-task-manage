import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Backend URL
  withCredentials: true
});

export default API;
