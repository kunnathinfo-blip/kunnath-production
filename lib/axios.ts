// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default api;


import axios from 'axios';

// For unified Next.js, relative URL '/api' is preferred, but fallback to base URL if configured.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;