import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export const registerUser = async (userData: { fullName: string; email: string; password: string; role: string }) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};