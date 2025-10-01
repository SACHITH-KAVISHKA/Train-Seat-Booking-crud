import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Train as TrainIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ConfirmationNumber as TicketIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { formatDate, formatCurrency } from '../../utils/helpers';

const TicketModal = ({ 
  open, 
  onClose, 
  bookingData, 
  scheduleData, 
  passengerData 
}) => {
  if (!open) {
    return null;
  }
  
  // Use mock data if real data is not available
  const mockBookingData = {
    pnrNumber: 'PNR123456789',
    bookingId: '123456',
    status: 'CONFIRMED',
    bookingDate: new Date().toISOString(),
    totalAmount: 2500
  };

  const mockScheduleData = {
    trainName: 'Colombo Express',
    trainNumber: 'TR001',
    departureStation: 'Colombo Fort',
    arrivalStation: 'Kandy',
    departureDate: new Date().toISOString(),
    departureTime: '08:30',
    arrivalTime: '11:45',
    fare: 2500
  };

  const mockPassengerData = {
    passengerName: 'Test Passenger',
    passengerEmail: 'test@example.com',
    passengerPhone: '+94771234567',
    seatCount: 1
  };

  const effectiveBookingData = bookingData || mockBookingData;
  const effectiveScheduleData = scheduleData || mockScheduleData;
  const effectivePassengerData = passengerData || mockPassengerData;

  const handleDownload = () => {
    // Create a simple ticket content for download
    const ticketContent = `
E-TICKET
========================================
PNR: ${effectiveBookingData.pnrNumber}
Booking ID: ${effectiveBookingData.bookingId}

PASSENGER DETAILS
Name: ${effectivePassengerData.passengerName}
Email: ${effectivePassengerData.passengerEmail}
Phone: ${effectivePassengerData.passengerPhone}

JOURNEY DETAILS
Train: ${effectiveScheduleData.trainName} (${effectiveScheduleData.trainNumber})
From: ${effectiveScheduleData.departureStation}
To: ${effectiveScheduleData.arrivalStation}
Date: ${formatDate(effectiveScheduleData.departureDate)}
Departure: ${effectiveScheduleData.departureTime}
Arrival: ${effectiveScheduleData.arrivalTime}

BOOKING DETAILS
Seats: ${effectivePassengerData.seatCount}
Fare per seat: ${formatCurrency(effectiveScheduleData.fare)}
Total Amount: ${formatCurrency(effectiveBookingData.totalAmount)}
Status: ${effectiveBookingData.status}
Booking Date: ${formatDate(effectiveBookingData.bookingDate)}

========================================
Sri Lanka Railways
This is a computer generated ticket.
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${effectiveBookingData.pnrNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          p: 3, 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TicketIcon />
          <Typography variant="h6">Booking Confirmation - E-Ticket</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {/* Ticket Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          p: 3,
          pt: 1,
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {effectiveScheduleData.trainName}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Train No: {effectiveScheduleData.trainNumber}
          </Typography>
        </Box>

        {/* Main Ticket Content */}
        <Box sx={{ p: 3 }}>
          {/* PNR and Status */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                PNR Number
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {effectiveBookingData.pnrNumber}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Chip 
                label={effectiveBookingData.status}
                color="success"
                sx={{ fontWeight: 'bold' }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Journey Details */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrainIcon color="primary" />
            Journey Details
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Departure */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    DEPARTURE
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {effectiveScheduleData.departureStation}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatDate(effectiveScheduleData.departureDate)} at {effectiveScheduleData.departureTime}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Arrival */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    ARRIVAL
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {effectiveScheduleData.arrivalStation}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatDate(effectiveScheduleData.departureDate)} at {effectiveScheduleData.arrivalTime}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Passenger Details */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            Passenger Details
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Passenger Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {effectivePassengerData.passengerName}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {effectivePassengerData.passengerEmail}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">
                {effectivePassengerData.passengerPhone}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Booking Summary */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Booking Summary
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Number of Seats
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {effectivePassengerData.seatCount}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Fare per Seat
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(effectiveScheduleData.fare)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Booking Date
              </Typography>
              <Typography variant="body1">
                {formatDate(effectiveBookingData.bookingDate)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(effectiveBookingData.totalAmount)}
              </Typography>
            </Grid>
          </Grid>

          {/* QR Code Placeholder */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            border: '2px dashed #ddd', 
            borderRadius: 2, 
            textAlign: 'center',
            backgroundColor: '#fafafa'
          }}>
            <QrCodeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              QR Code for Digital Verification
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Show this to the conductor during your journey
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              Sri Lanka Railways - Train Booking System
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              This is a computer generated e-ticket. Please carry a valid ID proof during your journey.
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ display: 'block', textAlign: 'center', mt: 1, fontWeight: 'bold' }}>
              Click OK to return to home page
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
        <Button 
          onClick={handleDownload} 
          variant="outlined" 
          startIcon={<DownloadIcon />}
          sx={{ mr: 2 }}
        >
          Download Ticket
        </Button>
        <Button 
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{ 
            minWidth: 120,
            fontWeight: 'bold'
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketModal;