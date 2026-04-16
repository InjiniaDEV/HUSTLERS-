import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default apiClient;
