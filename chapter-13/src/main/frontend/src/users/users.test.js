import {screen, within, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render} from '../__tests__/react-redux';
import {login, logout} from '../auth';
import {store} from '../store';
import {App} from '../App';

describe('users module tests', () => {
  let server;
  let app;
  beforeAll(() => {
    server = setupServer();
    server.listen();
  });
  beforeEach(async () => {
    server.use(rest.all('/api/*', (req, res, ctx) => res(ctx.status(404))));
    // all user module interaction requires a logged-in user
    server.use(rest.post('/api/v1/auth/login', (req, res, ctx) =>
      res(ctx.status(200), ctx.text('a-jwt'))));
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/');
  });
  afterEach(async () => {
    server.resetHandlers();
    app.unmount();
    await store.dispatch(logout());
  });
  afterAll(() => {
    server.close();
  });
  test('logged-in users can see their information', async () => {
    // Given
    server.use(rest.get('/api/v1/users/self', (req, res, ctx) =>
      res(ctx.status(200), ctx.json({id: 0, name: 'the-username', roles: ['user']}))));
    app = await render(<App />);
    userEvent.click(screen.getByLabelText(/Profile/));
    const userMenu = screen.getByRole('menu');
    // When
    const userNameEntry = await within(userMenu).findByText('the-username');
    // Then
    expect(userNameEntry).toBeInTheDocument();
    expect(userNameEntry).toHaveClass('MuiMenuItem-root');
  });
  test('logged-in users can change their password', async () => {
    // Given
    server.use(rest.put('/api/v1/users/self/password', (req, res, ctx) =>
      res(ctx.status(200), ctx.json({id: 0, name: 'the-username', roles: ['user']}))));
    app = await render(<App />);
    userEvent.click(screen.getByLabelText(/Profile/));
    userEvent.click(within(screen.getByRole('menu')).getByText(/Change Password/));
    const dialog = screen.getByRole('dialog');
    userEvent.type(within(dialog).getByLabelText(/Current password/), 'admin');
    userEvent.type(within(dialog).getByLabelText(/New password/), 'password');
    // When
    userEvent.click(screen.getByText(/Save/));
    // Then
    await waitForElementToBeRemoved(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  test('admins can navigate to the users page and see a list of users', async () => {
    // Given
    server.use(rest.get('/api/v1/users', (req, res, ctx) =>
      res(ctx.status(200), ctx.json([
        {id: 0, name: 'admin', roles: ['admin', 'user']},
        {id: 1, name: 'a-user', roles: ['user', 'other-role']}
      ]))));
    server.use(rest.get('/api/v1/users/self', (req, res, ctx) =>
      res(ctx.status(200), ctx.json({id: 0, name: 'admin', roles: ['admin', 'user']}))));
    app = await render(<App />);
    // When
    userEvent.click(await screen.findByLabelText(/Users/));
    // Then
    expect(await screen.findByText(/Users/, {selector: 'h2'})).toBeInTheDocument();
    const aUserRow = (await screen.findByText(/a-user/, {selector: 'td'})).closest('tr');
    expect(aUserRow).toBeInTheDocument();
    expect(within(aUserRow).getByText(/user, other-role/)).toBeInTheDocument();
  });
});
