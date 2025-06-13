import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

interface Account {
  accountId: string;
  workizApiKey: string;
  googleSheetsId: string;
  sources: string[];
}

function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<Account>({
    accountId: '',
    workizApiKey: '',
    googleSheetsId: '',
    sources: []
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleOpen = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormData(account);
    } else {
      setEditingAccount(null);
      setFormData({
        accountId: '',
        workizApiKey: '',
        googleSheetsId: '',
        sources: []
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccount(null);
  };

  const handleSubmit = async () => {
    try {
      const method = editingAccount ? 'PUT' : 'POST';
      const url = editingAccount 
        ? `/api/accounts/${editingAccount.accountId}`
        : '/api/accounts';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      fetchAccounts();
      handleClose();
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' });
        fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Accounts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Account
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.accountId}>
                <TableCell>{account.accountId}</TableCell>
                <TableCell>{account.googleSheetsId}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(account)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(account.accountId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAccount ? 'Edit Account' : 'Add Account'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Account ID"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Workiz API Key"
              value={formData.workizApiKey}
              onChange={(e) => setFormData({ ...formData, workizApiKey: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Google Sheets ID"
              value={formData.googleSheetsId}
              onChange={(e) => setFormData({ ...formData, googleSheetsId: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Sources (comma-separated)"
              value={formData.sources.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                sources: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              margin="normal"
              helperText="Enter sources separated by commas (e.g., Google, Facebook)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAccount ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Accounts; 