import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Chip,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  useTheme,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Search as SearchIcon,
  Train as TrainIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  SwapVert as SwapIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useBooking } from '../hooks/useBooking';
import { formatDate, formatTime, formatCurrency } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { searchTrains, searchResults, searchLoading, searchError, stations, getStations } = useBooking();

  // Search form state
  const [searchForm, setSearchForm] = useState({
    departureStation: '',
    arrivalStation: '',
    departureDate: null,
    seatCount: 1,
  });
  
  // Station loading state
  const [stationsLoading, setStationsLoading] = useState(false);

  // Initialize form with URL params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('from') || params.get('to') || params.get('date')) {
      setSearchForm({
        departureStation: params.get('from') || '',
        arrivalStation: params.get('to') || '',
        departureDate: params.get('date') ? new Date(params.get('date')) : null,
        seatCount: parseInt(params.get('passengers')) || 1,
      });
    }
  }, [location.search]);
  
  // Fetch stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      if (stations.length === 0) {
        try {
          setStationsLoading(true);
          await getStations();
        } catch (error) {
          console.error('Failed to fetch stations:', error);
          toast.error('Failed to load station data');
        } finally {
          setStationsLoading(false);
        }
      }
    };
    
    fetchStations();
  }, [getStations, stations.length]);

  const handleInputChange = (field, value) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSwapStations = () => {
    setSearchForm(prev => ({
      ...prev,
      departureStation: prev.arrivalStation,
      arrivalStation: prev.departureStation,
    }));
  };

  const handleSearch = async () => {
    if (!searchForm.departureStation || !searchForm.arrivalStation || !searchForm.departureDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const searchData = {
        departureStation: searchForm.departureStation,
        arrivalStation: searchForm.arrivalStation,
        departureDate: formatDate(searchForm.departureDate, 'yyyy-MM-dd'),
        seatCount: searchForm.seatCount,
      };

      await searchTrains(searchData);
      
      // Update URL with search params
      const params = new URLSearchParams({
        from: searchData.departureStation,
        to: searchData.arrivalStation,
        date: searchData.departureDate,
        passengers: searchData.seatCount.toString(),
      });
      navigate(`/search?${params.toString()}`, { replace: true });
      
    } catch (error) {
      toast.error('Failed to search trains. Please try again.');
    }
  };

  const handleBookNow = (schedule) => {
    // Pass the schedule data to the booking page
    navigate(`/book/${schedule.scheduleId}`, {
      state: { schedule: schedule }
    });
  };

  const getTrainTypeColor = (trainType) => {
    switch (trainType) {
      case 'FIRST_CLASS': return 'primary';
      case 'SECOND_CLASS': return 'secondary';
      case 'THIRD_CLASS': return 'default';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Search Trains
      </Typography>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={stations}
              value={searchForm.departureStation}
              onChange={(event, newValue) => {
                handleInputChange('departureStation', newValue || '');
              }}
              freeSolo
              loading={stationsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="From"
                  placeholder="Departure station"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {stationsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={handleSwapStations} color="primary">
              <SwapIcon />
            </IconButton>
          </Grid>

          <Grid item xs={12} md={3}>
            <Autocomplete
              options={stations}
              value={searchForm.arrivalStation}
              onChange={(event, newValue) => {
                handleInputChange('arrivalStation', newValue || '');
              }}
              freeSolo
              loading={stationsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="To"
                  placeholder="Arrival station"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {stationsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <DatePicker
              label="Departure Date"
              value={searchForm.departureDate}
              onChange={(date) => handleInputChange('departureDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    startAdornment: <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />,
                  },
                },
              }}
              minDate={new Date()}
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={searchLoading}
              startIcon={searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ height: 56 }}
            >
            </Button>
          </Grid>
        </Grid>

        {/* Popular Stations */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Available Stations:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {stations.slice(0, 8).map((station) => (
              <Chip
                key={station}
                label={station}
                size="small"
                onClick={() => {
                  if (!searchForm.departureStation) {
                    handleInputChange('departureStation', station);
                  } else if (!searchForm.arrivalStation && station !== searchForm.departureStation) {
                    handleInputChange('arrivalStation', station);
                  }
                }}
                sx={{ cursor: 'pointer' }}
              />
            ))}
            {stations.length > 8 && (
              <Chip
                label={`+${stations.length - 8} more`}
                size="small"
                variant="outlined"
                sx={{ cursor: 'default' }}
              />
            )}
          </Box>
        </Box>
      </Paper>

      {/* Search Results */}
      {searchError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {searchError}
        </Alert>
      )}

      {searchLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {searchResults && searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Trains ({searchResults.length} found)
          </Typography>
          
          <Grid container spacing={2}>
            {searchResults.map((schedule) => (
              <Grid item xs={12} key={schedule.scheduleId}>
                <Card sx={{ '&:hover': { elevation: 4, transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <TrainIcon color="primary" />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {schedule.trainName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {schedule.trainNumber}
                        </Typography>
                        <Chip
                          label={schedule.trainType?.replace('_', ' ')}
                          color={getTrainTypeColor(schedule.trainType)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {schedule.departureTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {schedule.departureStation}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mx: 2, textAlign: 'center' }}>
                            <Divider sx={{ mb: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(schedule.departureDate)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {schedule.arrivalTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {schedule.arrivalStation}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                            {formatCurrency(schedule.fare)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            per seat
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {schedule.availableSeats} seats available
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleBookNow(schedule)}
                          disabled={schedule.availableSeats === 0}
                          sx={{ mb: 1 }}
                        >
                          {schedule.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                          Total: {formatCurrency(schedule.fare * searchForm.seatCount)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {searchResults && searchResults.length === 0 && !searchLoading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <TrainIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No trains found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or check different dates
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchPage;