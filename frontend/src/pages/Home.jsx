import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Search as SearchIcon,
  Train as TrainIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { useBooking } from '../hooks/useBooking';
import { formatDate, getMinBookingDate, getMaxBookingDate } from '../utils/helpers';
import TestConnection from '../components/TestConnection';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { searchTrains, setSearchFilters } = useBooking();
  
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departureDate: null,
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSwapStations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchData.from || !searchData.to || !searchData.departureDate) {
      alert('Please fill in all search fields');
      return;
    }

    try {
      setIsSearching(true);
      
      const searchParams = {
        from: searchData.from,
        to: searchData.to,
        departureDate: formatDate(searchData.departureDate, 'yyyy-MM-dd'),
      };
      
      // Set search filters and navigate
      setSearchFilters(searchParams);
      navigate('/search');
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Fast Booking',
      description: 'Book your train tickets in just a few clicks with our streamlined process.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Payments',
      description: 'Your transactions are protected with industry-standard security measures.',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '24/7 Support',
      description: 'Get assistance anytime with our round-the-clock customer support.',
    },
  ];

  const popularRoutes = [
    { from: 'Colombo', to: 'Kandy', duration: '3h 30m' },
    { from: 'Colombo', to: 'Galle', duration: '2h 45m' },
    { from: 'Kandy', to: 'Ella', duration: '6h 15m' },
    { from: 'Colombo', to: 'Jaffna', duration: '8h 30m' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Your Journey Starts Here
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                opacity: 0.9,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Book train tickets effortlessly and travel with confidence
            </Typography>
          </Box>

          {/* Search Form */}
          <Paper
            component="form"
            onSubmit={handleSearch}
            elevation={8}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              {/* From Station */}
              <Grid item xs={12} md={3.5}>
                <TextField
                  fullWidth
                  label="From"
                  placeholder="Departure station"
                  value={searchData.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  required
                />
              </Grid>

              {/* Swap Button */}
              <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
                <IconButton
                  onClick={handleSwapStations}
                  sx={{
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.100',
                    },
                  }}
                >
                  <SwapIcon />
                </IconButton>
              </Grid>

              {/* To Station */}
              <Grid item xs={12} md={3.5}>
                <TextField
                  fullWidth
                  label="To"
                  placeholder="Arrival station"
                  value={searchData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  required
                />
              </Grid>

              {/* Date Picker */}
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Departure Date"
                  value={searchData.departureDate}
                  onChange={(date) => handleInputChange('departureDate', date)}
                  minDate={new Date(getMinBookingDate())}
                  maxDate={new Date(getMaxBookingDate())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>

              {/* Search Button */}
              <Grid item xs={12} md={1}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isSearching}
                  startIcon={<SearchIcon />}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {isMobile ? 'Search' : ''}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 2,
            color: 'primary.main',
          }}
        >
          Why Choose Us?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 6,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Experience the best in train travel booking with our comprehensive platform
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>


      {/* Call to Action Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Travel?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of satisfied travelers who book with us every day
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/search')}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Start Booking Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;