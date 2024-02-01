import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: process.env.FRONTEND_URL,
});
