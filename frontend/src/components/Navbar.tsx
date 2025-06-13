import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Workiz Google Sync
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/accounts"
          >
            Accounts
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/logs"
          >
            Sync Logs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 