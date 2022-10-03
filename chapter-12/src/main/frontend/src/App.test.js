import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render} from './__tests__/react-redux';
import {login} from './auth';
import {store} from './store';
import {App} from './App';

describe('Router tests', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
    server.listen();
  });
  beforeEach(() => {
    window.sessionStorage.clear();
    server.resetHandlers();
    server.use(rest.all('/api/*', (req, res, ctx) => res(ctx.status(404))));
  });
  afterAll(() => {
    server.close();
  });
  test('logged out user visiting /tasks, redirects to /login', () => {
    // Given
    window.history.pushState({}, '', '/tasks');
    // When
    render(<App />);
    // Then
    expect(window.location.pathname).toEqual('/login');
    expect(screen.getByText(/Sign in/, {selector: 'h1'}))
      .toBeInTheDocument();
  });
  test('logged in user visiting /tasks, displays /tasks', async () => {
    // Given
    server.use(rest.post('/api/v1/auth/login', (req, res, ctx) =>
      res(ctx.status(200), ctx.text('a-jwt'))));
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/tasks');
    // When
    render(<App />);
    // Then
    expect(window.location.pathname).toEqual('/tasks');
    expect(screen.getByText(/Task manager/, {selector: '.MuiTypography-h6'}))
      .toBeInTheDocument();
  });
  test('logged in user visiting /, gets redirected to /tasks/pending', async () => {
    // Given
    server.use(rest.post('/api/v1/auth/login', (req, res, ctx) =>
      res(ctx.status(200), ctx.text('a-jwt'))));
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/');
    // When
    render(<App />);
    // Then
    expect(await screen.findByText(/Task manager/, {selector: '.MuiTypography-h6'}))
      .toBeInTheDocument();
    expect(window.location.pathname).toEqual('/tasks/pending');
  });
});
