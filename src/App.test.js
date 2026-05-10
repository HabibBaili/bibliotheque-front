import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from './i18n/I18nContext';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => null,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>
}), { virtual: true });

jest.mock('./services/api', () => ({
  api: {
    getLivres: jest.fn(() => Promise.resolve({ data: [] })),
    getAdherents: jest.fn(() => Promise.resolve({ data: [] })),
    getEmprunts: jest.fn(() => Promise.resolve({ data: [] })),
    getBibliotheques: jest.fn(() => Promise.resolve({ data: [] })),
    getCategories: jest.fn(() => Promise.resolve({ data: [] }))
  }
}));

const App = require('./App').default;

test('renders the language switcher', () => {
  render(
    <I18nProvider>
      <App />
    </I18nProvider>
  );

  expect(screen.getByLabelText(/langue/i)).toBeInTheDocument();
});
