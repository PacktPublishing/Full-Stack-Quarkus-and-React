import React from 'react';
import {Link, useMatch} from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonIcon from '@mui/icons-material/Person';
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
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

const Projects = ({drawerOpen, openNewProject, projects}) => (
  <>
    <Divider/>
    <ListItem
      secondaryAction={drawerOpen &&
        <IconButton edge='end' onClick={openNewProject}>
          <AddIcon />
        </IconButton>
      }
    >
      <ListItemIcon><SnippetFolderIcon/></ListItemIcon>
      <ListItemText
        primaryTypographyProps={{fontWeight: 'medium'}}
      >
        Projects
      </ListItemText>
    </ListItem>
    {Array.from(projects).map(p => (
      <Item
        key={p.id} disableTooltip={drawerOpen}
        Icon={CircleIcon} iconSize='small'
        title={p.name} to={`/tasks/project/${p.id}`}/>
    ))}
  </>
);

export const MainDrawer = ({drawerOpen, toggleDrawer, openNewProject, projects = []}) => (
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
        <Item disableTooltip={drawerOpen} Icon={InboxIcon} title='Todo' to='/tasks/pending'/>
        <Item disableTooltip={drawerOpen} Icon={CheckIcon} title='Completed' to='/tasks/completed'/>
        <Item disableTooltip={drawerOpen} Icon={AssignmentIcon} title='All' to='/tasks'/>
        <Projects
          drawerOpen={drawerOpen} openNewProject={openNewProject} projects={projects}
        />
        <HasRole role='admin'>
          <Divider/>
          <Item disableTooltip={drawerOpen} Icon={PersonIcon} title='Users' to='/users'/>
        </HasRole>
      </List>
    </Box>
  </Drawer>
);
