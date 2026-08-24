const defaultApiBaseUrl = process.env.NODE_ENV === 'production'
  ? 'https://flight-api-suresh.onrender.com'
  : 'http://localhost:5000';

export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || defaultApiBaseUrl)
  .replace(/\/$/, '');

export const apiRequest = (path, options = {}) => {
  const { auth = false, headers = {}, ...requestOptions } = options;
  const requestHeaders = { ...headers };

  if (requestOptions.body && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: requestHeaders,
  });
};
