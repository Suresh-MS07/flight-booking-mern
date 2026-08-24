export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000')
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
