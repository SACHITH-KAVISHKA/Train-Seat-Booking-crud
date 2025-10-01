import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Train as TrainIcon } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box>
        <TrainIcon sx={{ fontSize: 120, color: 'primary.main', mb: 3 }} />
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: 'primary.main', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
          Sorry, the page you are looking for doesn't exist. The train might have left the station, 
          but you can still find your way back home.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            size="large"
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            size="large"
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;