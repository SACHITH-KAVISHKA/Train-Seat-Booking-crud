import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const SimpleTicketModal = ({ 
  open, 
  onClose, 
  bookingData, 
  scheduleData, 
  passengerData 
}) => {
  console.log('SimpleTicketModal - Props received:', {
    open,
    bookingData,
    scheduleData,
    passengerData
  });

  // Mock data for testing if real data is not available
  const mockBookingData = {
    pnrNumber: 'PNR123456789',
    status: 'CONFIRMED',
    totalAmount: 2500
  };

  const mockScheduleData = {
    trainName: 'Test Express',
    departureStation: 'Colombo Fort',
    arrivalStation: 'Kandy'
  };

  const mockPassengerData = {
    passengerName: 'Test Passenger',
    passengerEmail: 'test@example.com',
    seatCount: 1
  };

  const effectiveBookingData = bookingData || mockBookingData;
  const effectiveScheduleData = scheduleData || mockScheduleData;
  const effectivePassengerData = passengerData || mockPassengerData;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>E-Ticket Test</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Booking Details
        </Typography>
        
        <Typography>PNR: {effectiveBookingData.pnrNumber}</Typography>
        <Typography>Status: {effectiveBookingData.status}</Typography>
        <Typography>Total: Rs.{effectiveBookingData.totalAmount?.toLocaleString()}</Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Schedule Details
        </Typography>
        
        <Typography>Train: {effectiveScheduleData.trainName}</Typography>
        <Typography>From: {effectiveScheduleData.departureStation}</Typography>
        <Typography>To: {effectiveScheduleData.arrivalStation}</Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Passenger Details
        </Typography>
        
        <Typography>Name: {effectivePassengerData.passengerName}</Typography>
        <Typography>Email: {effectivePassengerData.passengerEmail}</Typography>
        <Typography>Seats: {effectivePassengerData.seatCount}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleTicketModal;