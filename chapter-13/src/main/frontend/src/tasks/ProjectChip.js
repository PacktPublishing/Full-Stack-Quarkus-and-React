import React from 'react';
import {Chip} from '@mui/material';

export const ProjectChip = ({task, size, onDelete}) => Boolean(task?.project) && (
  <Chip
    label={task.project.name}
    size={size}
    onDelete={!task.complete ? onDelete : undefined}
  />
);
