import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{
            color: 'grey.300',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Designed by SKM Labs
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;