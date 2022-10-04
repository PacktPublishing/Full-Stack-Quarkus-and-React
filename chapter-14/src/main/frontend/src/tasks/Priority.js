import React, {useState} from 'react';
import {IconButton, ListItemIcon, Menu, MenuItem} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

const colorMap = {
  1: 'error',
  2: 'warning',
  3: 'info'
}

export const Priority = ({priority}) => Boolean(priority) ?
  <FlagIcon color={colorMap[priority]}/> :
  <FlagOutlinedIcon/>;

export const EditPriority = ({priority, setPriority, disabled}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const onClick = val => () => {
    setPriority(val);
    setAnchorEl(null);
  }
  return (
    <>
      <IconButton
        disabled={disabled}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        <Priority priority={priority} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
      >
        {[...Array(3).keys()].map(i => i + 1).map(p =>
          <MenuItem key={p} onClick={onClick(p)}>
            <ListItemIcon>
              <FlagIcon color={colorMap[p]} />
            </ListItemIcon>
            Priority {p}
          </MenuItem>
        )}
        <MenuItem onClick={onClick(null)}>
          <ListItemIcon>
            <FlagOutlinedIcon />
          </ListItemIcon>
          No Priority
        </MenuItem>
      </Menu>
    </>
  );
};
