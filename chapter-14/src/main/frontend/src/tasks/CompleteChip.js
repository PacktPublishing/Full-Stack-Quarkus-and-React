import React from 'react';
import {Chip} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export const CompleteChip = ({task}) => Boolean(task?.complete) && (
  <Chip
    icon={<CheckIcon />}
    color='success'
    label={new Date(task.complete).toLocaleDateString()} variant='outlined'
    data-testid='complete-chip'
  />
);
