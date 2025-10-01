import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Train as TrainIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { formatDate, formatCurrency } from '../utils/helpers';
import { bookingService } from '../services/bookingService';
import TicketModal from '../components/common/TicketModal';

const BookingPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get schedule data passed from SearchPage
  const passedScheduleData = location.state?.schedule;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scheduleDetails, setScheduleDetails] = useState(passedScheduleData || null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    seatCount: 1,
  });

  const steps = ['Schedule Details', 'Passenger Information', 'Payment', 'Confirmation'];

  useEffect(() => {
    fetchScheduleDetails();
  }, [scheduleId]);

  const fetchScheduleDetails = async () => {
    // If we already have schedule details from navigation, use them
    if (scheduleDetails) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Note: Since we don't have a specific getScheduleDetails endpoint,
      // we'll use the passed data or redirect back to search
      if (!passedScheduleData) {
        setError('Schedule details not found. Please search again.');
        navigate('/search');
        return;
      }
      
      setScheduleDetails(passedScheduleData);
    } catch (error) {
      console.error('Failed to load schedule details:', error);
      setError('Failed to load schedule details. Please try again.');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { passengerName, passengerEmail, passengerPhone, seatCount } = bookingForm;
    
    if (!passengerName.trim() || passengerName.trim().length < 2) {
      alert('Passenger name must be at least 2 characters long');
      return false;
    }
    
    if (!passengerEmail.includes('@') || !passengerEmail.includes('.')) {
      alert('Please enter a valid email address');
      return false;
    }
    
    // Validate phone number format: +94771234567 or 0771234567 (10-15 digits)
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(passengerPhone.replace(/[\s\-\(\)]/g, ''))) {
      alert('Please enter a valid phone number (10-15 digits, may include + prefix)');
      return false;
    }
    
    if (seatCount < 1 || seatCount > 10) {
      alert('Seat count must be between 1 and 10');
      return false;
    }
    
    if (seatCount > scheduleDetails?.availableSeats) {
      alert(`Only ${scheduleDetails.availableSeats} seats available`);
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (activeStep === 1 && !validateForm()) {
      return;
    }
    
    if (activeStep === 2) {
      setShowConfirmDialog(true);
      return;
    }
    
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setShowConfirmDialog(false);
      setError(null);
      
      // Prepare booking data
      const bookingData = {
        scheduleId: scheduleDetails.scheduleId,
        passengerName: bookingForm.passengerName.trim(),
        passengerEmail: bookingForm.passengerEmail.trim(),
        passengerPhone: bookingForm.passengerPhone.replace(/[\s\-\(\)]/g, ''), // Remove spaces, dashes, parentheses
        seatCount: parseInt(bookingForm.seatCount, 10),
      };
      
      console.log('Creating booking with data:', bookingData);
      
      // Create booking using the real API
      const response = await bookingService.createBooking(bookingData);
      console.log('Booking created successfully:', response);
      
      const result = {
        pnrNumber: response.data.pnrNumber,
        bookingId: response.data.bookingId,
        status: response.data.bookingStatus,
        bookingDate: response.data.bookingDate,
        totalAmount: response.data.totalAmount,
      };
      
      setBookingSuccess(result);
      setActiveStep(3);
      
      // Show ticket modal immediately
      setShowTicketModal(true);
    } catch (error) {
      console.error('Booking failed:', error);
      setError(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return scheduleDetails ? scheduleDetails.fare * bookingForm.seatCount : 0;
  };

  const getTrainTypeColor = (trainType) => {
    switch (trainType) {
      case 'FIRST_CLASS': return 'primary';
      case 'SECOND_CLASS': return 'secondary';
      case 'THIRD_CLASS': return 'default';
      default: return 'default';
    }
  };

  if (loading && !scheduleDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!scheduleDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Schedule not found. Please go back and select a valid train.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            flexDirection: 'column',
          }}
        >
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Processing your booking...
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
            Please wait while we confirm your ticket
          </Typography>
        </Box>
      )}

      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Book Ticket
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Step 0: Schedule Details */}
          {activeStep === 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrainIcon color="primary" />
                  Train Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {scheduleDetails.trainName}
                      </Typography>
                      <Chip
                        label={scheduleDetails.trainType?.replace('_', ' ')}
                        color={getTrainTypeColor(scheduleDetails.trainType)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Train Number: {scheduleDetails.trainNumber}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationIcon color="primary" />
                      <Typography variant="h6">Departure</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {scheduleDetails.departureTime}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {scheduleDetails.departureStation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(scheduleDetails.departureDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationIcon color="secondary" />
                      <Typography variant="h6">Arrival</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {scheduleDetails.arrivalTime}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {scheduleDetails.arrivalStation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Next Day
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fare per seat
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      {formatCurrency(scheduleDetails.fare)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Available seats
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {scheduleDetails.availableSeats}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Passenger Information */}
          {activeStep === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  Passenger Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Passenger Name"
                      value={bookingForm.passengerName}
                      onChange={(e) => handleInputChange('passengerName', e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={bookingForm.passengerEmail}
                      onChange={(e) => handleInputChange('passengerEmail', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={bookingForm.passengerPhone}
                      onChange={(e) => handleInputChange('passengerPhone', e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />,
                      }}
                      placeholder="+94771234567"
                      helperText="Format: +94771234567 or 0771234567 (10-15 digits)"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Number of Seats"
                      type="number"
                      value={bookingForm.seatCount}
                      onChange={(e) => handleInputChange('seatCount', Math.max(1, parseInt(e.target.value) || 1))}
                      InputProps={{
                        inputProps: { min: 1, max: Math.min(10, scheduleDetails.availableSeats) },
                      }}
                      required
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment */}
          {activeStep === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentIcon color="primary" />
                  Payment Information
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                  This is a demo application. No actual payment will be processed.
                </Alert>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      disabled
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                      disabled
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      disabled
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {activeStep === 3 && bookingSuccess && (
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Booking Confirmed!
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 1 }}>
                  PNR Number: {bookingSuccess.pnrNumber}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your ticket has been booked successfully. Please check your e-ticket details.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          {activeStep < 3 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {activeStep === 2 ? 'Confirm Booking' : 'Next'}
              </Button>
            </Box>
          )}
        </Grid>

        {/* Booking Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Booking Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Train
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {scheduleDetails.trainName}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Route
                </Typography>
                <Typography variant="body1">
                  {scheduleDetails.departureStation} → {scheduleDetails.arrivalStation}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {formatDate(scheduleDetails.departureDate)} at {scheduleDetails.departureTime}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Passengers
                </Typography>
                <Typography variant="body1">
                  {bookingForm.seatCount} {bookingForm.seatCount === 1 ? 'seat' : 'seats'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Base Fare:</Typography>
                <Typography variant="body2">
                  {formatCurrency(scheduleDetails.fare)} × {bookingForm.seatCount}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Amount:</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                  {formatCurrency(getTotalAmount())}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please confirm your booking details:
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Train:</strong> {scheduleDetails.trainName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Passenger:</strong> {bookingForm.passengerName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Seats:</strong> {bookingForm.seatCount}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Total Amount:</strong> {formatCurrency(getTotalAmount())}
          </Typography>
          
          <Alert severity="warning">
            Please ensure all details are correct. This booking cannot be modified after confirmation.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Modal */}
      <TicketModal
        open={showTicketModal}
        onClose={() => {
          setShowTicketModal(false);
          navigate('/');
        }}
        bookingData={bookingSuccess}
        scheduleData={scheduleDetails}
        passengerData={bookingForm}
      />
    </Container>
  );
};

export default BookingPage;