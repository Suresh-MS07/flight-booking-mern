import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the SkyBooker landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /make your travel dreams reality/i }))
    .toBeInTheDocument();
});
