import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import SyncLogs from './pages/SyncLogs';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Workiz Google Sync
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/accounts" style={{ color: 'white', textDecoration: 'none' }}>Accounts</Link>
              <Link to="/logs" style={{ color: 'white', textDecoration: 'none' }}>Sync Logs</Link>
            </Box>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/logs" element={<SyncLogs />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App; 