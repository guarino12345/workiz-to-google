import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';

function Dashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sync Status
            </Typography>
            <Typography>
              Last sync: Not yet synced
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Status
            </Typography>
            <Typography>
              No accounts configured
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard; 