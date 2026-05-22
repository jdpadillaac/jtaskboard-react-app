import { TASK_STATUSES, type TaskStatus } from '@domain/task/task';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import StatusBadge from './StatusBadge';

interface StatusSelectProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
  disabled?: boolean;
}

function StatusSelect({ status, onChange, disabled = false }: StatusSelectProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleOpen(e: React.MouseEvent<HTMLElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function select(next: TaskStatus) {
    handleClose();
    if (next !== status) onChange(next);
  }

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          background: 'none',
          border: 'none',
          cursor: disabled ? 'default' : 'pointer',
          padding: 0,
        }}
      >
        <StatusBadge status={status} />
        <KeyboardArrowDownIcon fontSize="small" aria-hidden="true" />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {TASK_STATUSES.map((s) => (
          <MenuItem key={s} onClick={() => select(s)} selected={s === status}>
            <StatusBadge status={s} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default StatusSelect;
