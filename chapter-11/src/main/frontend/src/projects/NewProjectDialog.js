import React from 'react';
import {useForm} from '../useForm';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import {closeNewProject} from '../layout';
import {api} from './';

export const NewProjectDialog = () => {
  const {values, invalid, isValid, error, setError, clearForm, onChange} = useForm({
    initialValues: {name: ''}
  });
  const dispatch = useDispatch();
  const newProjectOpen = useSelector(state => state.layout.newProjectOpen);
  const close = () => dispatch(closeNewProject());
  const [addProject] = api.endpoints.addProject.useMutation();
  const canSave = isValid && Boolean(values.name);
  const save = () => {
    addProject(values).then(({error: saveError}) => {
      if (!Boolean(saveError)) {
        clearForm();
        close();
      } else {
        setError('Unknown error, please try again');
      }
    });
  };
  return (
    <Dialog open={newProjectOpen} onClose={close}>
      <DialogTitle>New Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add a new project.
        </DialogContentText>
        {Boolean(error) && <Alert severity='error'>{error}</Alert>}
        <TextField
          autoFocus
          fullWidth
          variant='standard'
          label='Name'
          name='name'
          value={values.name}
          onChange={onChange}
          onKeyDown={e => e.key === 'Enter' && canSave && save()}
          error={Boolean(invalid.name)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={save} disabled={!canSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
