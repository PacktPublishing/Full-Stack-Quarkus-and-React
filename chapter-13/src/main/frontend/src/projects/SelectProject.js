import React, {useState} from 'react';
import {IconButton, ListItemIcon, Menu, MenuItem} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {api} from './api';

export const SelectProject = ({disabled, onSelectProject = () => {}}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const {data: projects} = api.endpoints.getProjects.useQuery(undefined);
  const onClick = project => () => {
    setAnchorEl(null);
    onSelectProject(project);
  }
  return (
    <>
      <IconButton
        disabled={disabled}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        <LocalOfferIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
      >
        {projects.map(p =>
          <MenuItem key={p.id} onClick={onClick(p)}>
            <ListItemIcon>
              <CircleIcon />
            </ListItemIcon>
            {p.name}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
