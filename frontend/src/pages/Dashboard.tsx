import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid,
  CircularProgress
} from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

interface SyncStatus {
  lastSync: string;
  jobsProcessed: number;
  status: 'success' | 'error' | 'pending';
}

function Dashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/jobs/sync', { method: 'POST' });
      const data = await response.json();
      setSyncStatus({
        lastSync: new Date().toISOString(),
        jobsProcessed: data.jobsProcessed || 0,
        status: 'success'
      });
    } catch (error) {
      setSyncStatus({
        lastSync: new Date().toISOString(),
        jobsProcessed: 0,
        status: 'error'
      });
    }
    setIsSyncing(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sync Status
              </Typography>
              {syncStatus ? (
                <Box>
                  <Typography>
                    Last Sync: {new Date(syncStatus.lastSync).toLocaleString()}
                  </Typography>
                  <Typography>
                    Jobs Processed: {syncStatus.jobsProcessed}
                  </Typography>
                  <Typography color={syncStatus.status === 'success' ? 'success.main' : 'error.main'}>
                    Status: {syncStatus.status}
                  </Typography>
                </Box>
              ) : (
                <Typography>No sync data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Manual Sync
              </Typography>
              <Button
                variant="contained"
                startIcon={isSyncing ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
                onClick={triggerSync}
                disabled={isSyncing}
              >
                {isSyncing ? 'Syncing...' : 'Trigger Sync'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 