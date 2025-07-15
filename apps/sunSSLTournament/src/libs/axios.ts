import axios from 'axios';

export const getAxiosInstance = () =>
  axios.create({
    baseURL: process.env.FRONTEND_URL,
  });
