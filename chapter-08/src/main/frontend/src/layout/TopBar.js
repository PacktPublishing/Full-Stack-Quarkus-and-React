import React from 'react';
import {AppBar, IconButton, Toolbar, Tooltip, Typography} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';

export const TopBar = ({goHome, newTask, toggleDrawer}) => (
  <AppBar
    position='fixed'
    sx={{
      zIndex: theme => theme.zIndex.drawer + 1
    }}
  >
    <Toolbar>
      <IconButton
        size='large'
        edge='start'
        color='inherit'
        aria-label='menu'
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
      <Tooltip title='Home'>
        <IconButton
          color='inherit'
          onClick={goHome}
        >
          <HomeOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
        Task manager
      </Typography>
      <Tooltip title='Quick Add'>
        <IconButton
          color='inherit'
          onClick={newTask}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <AccountCircleIcon />
    </Toolbar>
  </AppBar>
);

