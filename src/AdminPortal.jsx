import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Typography, Paper, Box, Alert } from '@mui/material';

const AdminPortal = () => {
  const [phone, setPhone] = useState('');
  const [template, setTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || []);
        if (data.templates && data.templates.length > 0) {
          setTemplate(data.templates[0].name);
        }
      })
      .catch(() => setError('Failed to load templates'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, template }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult('Message sent successfully!');
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>Admin Portal</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            required
            placeholder="e.g. 15551234567"
          />
          <TextField
            select
            label="Message Template"
            value={template}
            onChange={e => setTemplate(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={templates.length === 0}
          >
            {templates.map(opt => (
              <MenuItem key={opt.name} value={opt.name}>{opt.display_name}</MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading || templates.length === 0}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
        {result && <Alert severity="success" sx={{ mt: 2 }}>{result}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
};

export default AdminPortal; 