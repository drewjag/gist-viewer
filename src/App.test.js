import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders initial page elements', () => {
  render(<App />);
  const usernameInput = screen.getByTestId('input-username');
  const buttonInput = screen.getByTestId('button-getGists');

  expect(usernameInput).toBeInTheDocument();
  expect(buttonInput).toBeInTheDocument();
  expect(buttonInput).toBeDisabled();
});

test('enables Get Gists button when username is given', () => {
  render(<App />);

  const usernameInput = screen.getByRole('textbox');
  const buttonInput = screen.getByTestId('button-getGists');

  userEvent.type(usernameInput, 'drewjag');

  expect(buttonInput).toBeEnabled();
});


test('renders gist list table when data is received', () => {
  // would need to mock out response for list of gists
  // assert for existence of table
  // check for value rendered in first cell
});

test('renders gist details when a row in gist list table is clicked', () => {
  // would need to mock out response for single gist
  // assert for existence of back button, headings, etc
  // assert that gist list is no longer rendered
});

test('renders gist details when a row in gist list table is clicked', () => {
  // would need to mock out response for single gist and list of gists
  // click back button
  // assert for existence of gist list
  // assert that gist details is no longer rendered
});