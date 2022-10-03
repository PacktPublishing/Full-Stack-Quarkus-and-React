import React from 'react';
import {Container, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {api} from './api';
import {Layout} from '../layout';

export const Users = () => {
  const {data: allUsers} = api.endpoints.getUsers.useQuery(undefined, {pollingInterval: 10000});
  const {data: self} = api.endpoints.getSelf.useQuery();
  const [deleteUser] = api.endpoints.deleteUser.useMutation();
  return <Layout>
    <Container sx={{mt: theme => theme.spacing(2)}}>
      <Paper sx={{p: 2}}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Users
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUsers && allUsers.map(user =>
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{new Date(user.created).toLocaleDateString()}</TableCell>
                <TableCell>{user.roles.join(', ')}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    disabled={user.id === self?.id} onClick={() => deleteUser(user)}
                  >
                    <DeleteIcon/>
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  </Layout>;
};
