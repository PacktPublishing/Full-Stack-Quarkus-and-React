import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {api} from './api';
import {CompleteChip} from './CompleteChip';
import {EditPriority} from './Priority';
import {clearOpenTask, setOpenTask} from '../layout';
import {SelectProject} from '../projects';
import {ProjectChip} from './ProjectChip';


export const EditTask = () => {
  const dispatch = useDispatch();
  const openTask = useSelector(state => state.layout.openTask);
  const isNew = openTask && !Boolean(openTask.id);
  const isComplete = openTask && Boolean(openTask.complete);
  const dialogOpen = Boolean(openTask);
  const close = () => dispatch(clearOpenTask());
  const [addTask] = api.endpoints.addTask.useMutation();
  const [updateTask] = api.endpoints.updateTask.useMutation();
  const save = event => {
    event.preventDefault();
    if (event.currentTarget.checkValidity()) {
      const operation = isNew ? addTask: updateTask;
      operation(openTask).then(({error}) => {
        if (!Boolean(error)) {
          close();
        } else {
          console.log(error);
        }
      });
    }
  };
  const [deleteTask] = api.endpoints.deleteTask.useMutation();
  const doDeleteTask = () => {
    deleteTask(openTask).then(({error}) => {
      if (!Boolean(error)) {
        close();
      }
    })
  };
  const [invalid, setInvalid] = useState( {});
  const onChange = event => {
    const {name, value} = event.currentTarget;
    setInvalid({...invalid, [name]: !event.currentTarget.checkValidity()});
    dispatch(setOpenTask({...openTask,
      [name]: value,
    }));
  };
  const setPriority = priority => dispatch(setOpenTask({...openTask, priority}));
  return (
    <Dialog
      fullScreen
      open={dialogOpen}
    >
      {Boolean(openTask) && (
        <Box component='form' onSubmit={save}>
          <AppBar sx={{position: 'relative'}}>
            <Toolbar>
              <IconButton
                edge='start'
                color='inherit'
                onClick={close}
                aria-label='close'
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                {isNew ? 'New Task' : 'Edit Task'}
              </Typography>
              <IconButton
                color='inherit'
                aria-label='delete'
                disabled={isComplete}
                onClick={doDeleteTask}
              >
                <DeleteIcon />
              </IconButton>
              <Button type='submit' color='inherit' disabled={isComplete}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <Grid container sx={{p: 2}}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin='normal'
                label='Title'
                name='title'
                value={openTask.title}
                onChange={onChange}
                error={Boolean(invalid.title)}
                required
                autoFocus
                inputProps={{
                  readOnly: isComplete
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin='normal'
                label='Description'
                name='description'
                value={openTask.description ?? ''}
                onChange={onChange}
                error={Boolean(invalid.description)}
                multiline
                rows={4}
                inputProps={{
                  readOnly: isComplete,
                  maxLength: 1000
              }}
              />
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <CompleteChip task={openTask} />
                <ProjectChip task={openTask} onDelete={() => dispatch(setOpenTask({...openTask, project: null}))} />
              </Grid>
              <Grid item xs={6} display='flex' justifyContent='flex-end'>
                <SelectProject
                  disabled={isComplete}
                  onSelectProject={project => dispatch(setOpenTask({...openTask, project}))}
                />
                <EditPriority
                  disabled={isComplete}
                  priority={openTask.priority} setPriority={setPriority}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </Dialog>
  );
};
