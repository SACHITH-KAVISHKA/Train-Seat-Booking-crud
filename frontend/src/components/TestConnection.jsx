import React, { useState } from 'react';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../utils/constants';

const TestConnection = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    try {
      // Test health endpoint
      console.log('Testing API connection...');
      const response = await api.get(API_ENDPOINTS.HEALTH);
      setResult(`Connection successful! Backend is accessible. Status: ${response.data.data.status}`);
      console.log('Connection test result:', response.data);
    } catch (err) {
      console.error('Connection test failed:', err);
      setError(`Connection failed: ${err.message || 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const testLoginEndpoint = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    try {
      // Test login endpoint with dummy data (should return validation error, not 404)
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        email: 'test@example.com',
        password: 'testpassword'
      });
      setResult('Login endpoint is accessible!');
      console.log('Login test result:', response.data);
    } catch (err) {
      console.error('Login test:', err);
      // If we get a 401 or 400, the endpoint exists but credentials are wrong
      if (err.status === 401 || err.status === 400) {
        setResult('Login endpoint is working! (Got expected auth error)');
      } else if (err.status === 404) {
        setError('Login endpoint not found (404)');
      } else {
        setError(`Login endpoint error: ${err.message}`);
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        API Connection Test
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={testConnection}
          disabled={testing}
          startIcon={testing ? <CircularProgress size={20} /> : null}
        >
          Test Health Endpoint
        </Button>
        
        <Button
          variant="outlined"
          onClick={testLoginEndpoint}
          disabled={testing}
          startIcon={testing ? <CircularProgress size={20} /> : null}
        >
          Test Login Endpoint
        </Button>
      </Box>

      {result && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {result}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary">
        Current API Base URL: {api.defaults.baseURL}
      </Typography>
    </Box>
  );
};

export default TestConnection;