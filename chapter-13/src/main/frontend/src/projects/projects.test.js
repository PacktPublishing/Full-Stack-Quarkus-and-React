import {screen, within, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render} from '../__tests__/react-redux';
import {login} from '../auth';
import {store} from '../store';
import {App} from '../App';

describe('projects module tests', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
    server.listen();
  });
  beforeEach(async () => {
    server.resetHandlers();
    server.use(rest.all('/api/*', (req, res, ctx) => res(ctx.status(404))));
    // all project module interaction requires a logged-in user
    server.use(rest.post('/api/v1/auth/login', (req, res, ctx) =>
      res(ctx.status(200), ctx.text('a-jwt'))));
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/');
  });
  afterAll(() => {
    server.close();
  });
  test('users can create projects', async () => {
    // Given
    server.use(rest.post('/api/v1/projects', (req, res, ctx) =>
        res(ctx.status(201), ctx.json({name: req.body.name}))));
    render(<App />);
    userEvent.click(within(screen.getByText(/Projects/).closest('li')).getByTestId(/AddIcon/));
    const dialog = screen.getByRole('dialog');
    userEvent.type(within(dialog).getByLabelText(/Name/), 'new-project');
    // When
    userEvent.click(screen.getByText(/Save/));
    // Then
    await waitForElementToBeRemoved(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  test('users can see their projects in the drawer', async () => {
    // Given
    server.use(rest.get('/api/v1/projects', (req, res, ctx) =>
        res(ctx.status(200), ctx.json([{id: 0, name: 'A Project'}]))));
    // When
    render(<App />);
    // Then
    expect(await screen.findByText('A Project')).toBeInTheDocument();
  });
});
