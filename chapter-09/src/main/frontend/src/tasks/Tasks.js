import React from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {api} from './api';
import {Priority} from './Priority';
import {Layout, newTask, setOpenTask} from '../layout';
import {api as projectApi} from '../projects';
import {ProjectChip} from './ProjectChip';

const taskSort = (t1, t2) => {
  const p1 = t1.priority ?? Number.MAX_SAFE_INTEGER;
  const p2 = t2.priority ?? Number.MAX_SAFE_INTEGER;
  if (p1 !== p2) {
    return p1 - p2
  }
  return t1.id - t2.id;
};

export const Tasks = ({title = 'Tasks', filter = () => true}) => {
  const {projectId} = useParams();
  const {project} = projectApi.endpoints.getProjects.useQuery(undefined, {
    selectFromResult: ({data}) => ({project: data?.find(p => p.id === parseInt(projectId))})
  });
  if (Boolean(project)) {
    title = project?.name;
    filter = task => task.project?.id === project.id;
  }
  const dispatch = useDispatch();
  const {data} = api.endpoints.getTasks.useQuery(undefined, {pollingInterval: 10000});
  const [setComplete] = api.endpoints.setComplete.useMutation();
  return <Layout>
    <Container sx={{mt: theme => theme.spacing(2)}}>
      <Paper sx={{p: 2}}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
        <Table size='small'>
          <TableBody>
              {data && Array.from(data).filter(filter).sort(taskSort).map(task =>
              <TableRow key={task.id}>
                <TableCell sx={{width: '2rem'}}>
                  <Checkbox
                    checked={Boolean(task.complete)}
                    checkedIcon={<CheckCircleIcon fontSize='small' />}
                    icon={<RadioButtonUncheckedIcon fontSize='small' />}
                    onChange={() => setComplete({task, complete: !Boolean(task.complete)})}
                  />
                </TableCell>
                <TableCell
                  onClick={() => dispatch(setOpenTask(task))}
                  sx={{cursor: 'pointer'}}
                >
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box sx={{flex: 1}}>
                      {!Boolean(project) && <ProjectChip task={task} size='small' />} {task.title}
                    </Box>
                    <Box>
                      {Boolean(task.priority) && <Priority priority={task.priority} />}
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Box sx={{mt: 2}}>
          <Button startIcon={<AddIcon />} onClick={() => dispatch(newTask({project: project}))}>
            Add task
          </Button>
        </Box>
      </Paper>
    </Container>
  </Layout>;
};
