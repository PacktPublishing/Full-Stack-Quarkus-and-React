import {screen,  within, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render} from '../__tests__/react-redux';
import {login} from '../auth';
import {store} from '../store';
import {App} from '../App';

describe('tasks module tests', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
    server.listen();
  });
  beforeEach(async () => {
    server.resetHandlers();
    server.use(rest.get('/api/v1/tasks', (req, res, ctx) =>
      res(ctx.status(200), ctx.json([
        {id: 1, title: 'Pending task 1', description: 'A description', priority: 1, project: {id: 0, name: 'Work stuff'}},
        {id: 2, title: 'Pending task 2', project: {id: 1, name: 'Home stuff'}},
        {id: 3, title: 'Completed task 3', complete: '2015-10-21', project: {id: 1, name: 'Home stuff'}},
      ]))
    ));
    server.use(rest.get('/api/v1/projects', (req, res, ctx) =>
      res(ctx.status(200), ctx.json([{id: 0, name: 'Work stuff'}, {id: 1, name: 'Home stuff'}]))));
    server.use(rest.get('/api/v1/users/self', (req, res, ctx) =>
      res(ctx.status(200), ctx.json({id: 0, name: 'user', roles: ['user', 'admin']}))));
    // all task module interaction requires a logged-in user
    server.use(rest.post('/api/v1/auth/login', (req, res, ctx) =>
      res(ctx.status(200), ctx.text('a-jwt'))));
    await store.dispatch(login({name: 'user', password: 'password'}));
    window.history.pushState({}, '', '/');
  });
  afterAll(() => {
    server.close();
  });
  describe('users can create tasks', () => {
    let taskRequestBody;
    beforeEach(() => {
      server.use(rest.post('/api/v1/tasks', (req, res, ctx) => {
        taskRequestBody = req.body;
        return req.body.title === 'new-task' ?
          res(ctx.status(201), ctx.json({...req.body})) : res(ctx.status(401));
      }));
    });
    const renderApp = async () => {
      render(<App />);
      await screen.findByLabelText(/Work stuff/);
    };
    test('from top bar', async () => {
      // Given
      await renderApp();
      userEvent.click(screen.getByLabelText('Quick Add'));
      const dialog = screen.getByRole('dialog');
      userEvent.type(within(dialog).getByLabelText(/Title/), 'new-task');
      // When
      userEvent.click(screen.getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(taskRequestBody.title).toEqual('new-task');
    });
    test('from tasks page', async () => {
      // Given
      await renderApp();
      userEvent.click(screen.getByText('Add task'));
      const dialog = screen.getByRole('dialog');
      userEvent.paste(within(dialog).getByLabelText(/Title/), 'new-task');
      userEvent.paste(within(dialog).getByLabelText(/Description/), 'A description');
      // When
      userEvent.click(screen.getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(taskRequestBody.description).toEqual('A description');
    });
    test('with priority', async () => {
      // Given
      await renderApp();
      userEvent.click(screen.getByText('Add task'));
      const dialog = screen.getByRole('dialog');
      userEvent.paste(within(dialog).getByLabelText(/Title/), 'new-task');
      userEvent.click(within(dialog).getByTestId('FlagOutlinedIcon'));
      userEvent.click(await screen.findByText(/Priority 2/));
      // When
      userEvent.click(screen.getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(taskRequestBody.priority).toEqual(2);
    });
    test('with project', async () => {
      // Given
      await renderApp();
      userEvent.click(screen.getByText('Add task'));
      const dialog = screen.getByRole('dialog');
      userEvent.paste(within(dialog).getByLabelText(/Title/), 'new-task');
      userEvent.click(within(dialog).getByTestId('LocalOfferIcon'));
      userEvent.click(within(await screen.findByRole('menu')).getByText(/Home stuff/));
      // When
      userEvent.click(screen.getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(taskRequestBody.project).toMatchObject({id: 1, name: 'Home stuff'});
    });
  });
  describe('users can list tasks', () => {
    test('pending', async () => {
      // Given
      render(<App />);
      // When
      await screen.findByText(/Pending task 1/);
      // Then
      expect(screen.queryAllByTestId('RadioButtonUncheckedIcon')).toHaveLength(2);
      expect(screen.queryAllByTestId('CheckCircleIcon')).toHaveLength(0);
      expect(screen.getByText(/Pending task 1/)).toBeInTheDocument();
      expect(screen.getByText(/Pending task 2/)).toBeInTheDocument();
      expect(screen.queryByText(/Completed task 3/)).not.toBeInTheDocument();
    });
    test('completed', async () => {
      // Given
      window.history.pushState({}, '', '/tasks/completed');
      render(<App />);
      // When
      await screen.findByText(/Completed task 3/);
      // Then
      expect(screen.queryAllByTestId('RadioButtonUncheckedIcon')).toHaveLength(0);
      expect(screen.queryAllByTestId('CheckCircleIcon')).toHaveLength(1);
      expect(screen.getByText(/Completed task 3/)).toBeInTheDocument();
      expect(screen.queryByText(/Pending task 1/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Pending task 2/)).not.toBeInTheDocument();
    });
    test('for project', async () => {
      // Given
      render(<App />);
      userEvent.click(await screen.findByText(/Work stuff/, {selector: 'a.MuiListItemButton-root span'}));
      await screen.findByText(/Work stuff/, {selector: 'h2'});
      // When
      await screen.findByText(/Pending task 1/);
      // Then
      expect(screen.queryAllByTestId('RadioButtonUncheckedIcon')).toHaveLength(1);
      expect(screen.queryAllByTestId('CheckCircleIcon')).toHaveLength(0);
      expect(screen.getByText(/Pending task 1/)).toBeInTheDocument();
      expect(screen.queryByText(/Completed task 3/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Pending task 2/)).not.toBeInTheDocument();
    });
  });
  describe('users can edit tasks', () => {
    let updateRequestBody;
    beforeEach(() => {
      server.use(rest.put('/api/v1/tasks/1', (req, res, ctx) => {
        updateRequestBody = req.body;
        return res(ctx.status(200));
      }));
    });
    test('to change text fields', async () => {
      // Given
      render(<App />);
      userEvent.click(await screen.findByText(/Pending task 1/));
      const dialog = await screen.findByRole('dialog');
      // When
      userEvent.type(within(dialog).getByLabelText(/Title/), '{selectall}Changed title');
      userEvent.type(within(dialog).getByLabelText(/Description/), '{selectall}Changed description');
      userEvent.click(within(dialog).getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(updateRequestBody).toMatchObject({
        title: 'Changed title',
        description: 'Changed description'
      });
    });
    test('to change priority', async () => {
      // Given
      await render(<App />);
      userEvent.click(await screen.findByText(/Pending task 1/));
      const dialog = await screen.findByRole('dialog');
      // When
      userEvent.click(within(dialog).getByTestId('FlagIcon'));
      userEvent.click(await screen.findByText(/Priority 3/));
      userEvent.click(within(dialog).getByText(/save/));
      // Then
      await waitForElementToBeRemoved(dialog);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(updateRequestBody).toMatchObject({
        priority: 3
      });
    });
  });
});
