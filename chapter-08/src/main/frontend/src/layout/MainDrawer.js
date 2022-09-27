import React from 'react';
import {Link, useMatch} from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonIcon from '@mui/icons-material/Person';
import {HasRole} from '../auth';

const Item = ({Icon, iconSize, title, to, disableTooltip=false}) => {
  const match = Boolean(useMatch(to));
  return (
    <ListItemButton component={Link} to={to} selected={match}>
      {Icon && <Tooltip title={title} placement='right' disableHoverListener={disableTooltip}>
        <ListItemIcon><Icon fontSize={iconSize}/></ListItemIcon>
      </Tooltip>
      }
      <ListItemText primary={title}/>
    </ListItemButton>
  )
};

export const MainDrawer = ({drawerOpen, toggleDrawer}) => (
  <Drawer
    open={drawerOpen} onClose={toggleDrawer} variant='permanent'
    sx={{
      width: theme => drawerOpen ? theme.layout.drawerWidth : theme.spacing(7),
      '& .MuiDrawer-paper': theme => ({
        width: theme.layout.drawerWidth,
        ...(!drawerOpen && {
          width: theme.spacing(7),
          overflowX: 'hidden'
        })
      })
    }}
  >
    <Toolbar/>
    <Box sx={{overflow: drawerOpen ? 'auto' : 'hidden'}}>
      <List>
        <Item disableTooltip={drawerOpen} Icon={InboxIcon} title='Todo' to='/'/>
        <HasRole role='admin'>
          <Divider/>
          <Item disableTooltip={drawerOpen} Icon={PersonIcon} title='Users' to='/users'/>
        </HasRole>
      </List>
    </Box>
  </Drawer>
);
