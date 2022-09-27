import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {IconButton, ListItemIcon, Menu, MenuItem, Tooltip} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import {logout} from '../auth';
import {api} from '../users';
import {openChangePassword} from './redux';

export const UserIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const closeMenu = () => setAnchorEl(null);
  const dispatch = useDispatch();
  const {data} = api.endpoints.getSelf.useQuery();
  return (
    <>
      <Tooltip title='Profile'>
        <IconButton color='inherit' onClick={event => setAnchorEl(event.currentTarget)}>
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
      >
        {data && <MenuItem>{data.name}</MenuItem>}
        <MenuItem onClick={() => {
          dispatch(openChangePassword());
          closeMenu();
        }}>
          <ListItemIcon>
            <KeyIcon />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={() => dispatch(logout())}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
