import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => {
  const React = require('react');
  const passThrough = ({ children }) => React.createElement(React.Fragment, null, children);

  return {
    BrowserRouter: passThrough,
    Routes: passThrough,
    Route: ({ path, element }) => (path === '/' ? element : null),
    Link: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
    NavLink: ({ children, to, end, ...props }) => React.createElement('a', { href: to, 'data-end': end ? 'true' : undefined, ...props }, children),
    useLocation: () => ({ pathname: '/', state: null }),
    useNavigate: () => jest.fn(),
    useSearchParams: () => [new URLSearchParams()],
  };
}, { virtual: true });

test('renders the SkyBooker landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /where will your next story begin/i }))
    .toBeInTheDocument();
});
