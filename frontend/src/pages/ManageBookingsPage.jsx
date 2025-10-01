import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';
import { formatDate, formatCurrency } from '../utils/helpers';
import { bookingService } from '../services/bookingService';
import { BOOKING_STATUS } from '../utils/constants';

const ManageBookingsPage = () => {
  const navigate = useNavigate();

  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    seatCount: 1,
  });

  useEffect(() => {
    fetchAllBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookingService.getAllBookings();
      console.log('Fetched bookings:', response);
      
      setBookings(response);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by search term (PNR, passenger name, train name)
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.pnrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.trainNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(booking => booking.bookingStatus === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      passengerName: booking.passengerName,
      passengerEmail: booking.passengerEmail,
      passengerPhone: booking.passengerPhone,
      seatCount: booking.seatCount,
    });
    setEditDialogOpen(true);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        passengerName: editForm.passengerName,
        passengerEmail: editForm.passengerEmail,
        passengerPhone: editForm.passengerPhone,
        seatCount: editForm.seatCount,
      };

      const response = await bookingService.updateBooking(selectedBooking.bookingId, updateData);
      console.log('Booking updated:', response);

      // Refresh bookings list
      await fetchAllBookings();
      
      setEditDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmCancelBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.cancelBooking(selectedBooking.bookingId);
      console.log('Booking cancelled:', response);

      // Refresh bookings list
      await fetchAllBookings();
      
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return 'success';
      case BOOKING_STATUS.CANCELLED:
        return 'error';
      case BOOKING_STATUS.PENDING:
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && bookings.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Manage Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View, update, and manage all train bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by PNR, Name, Train..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value={BOOKING_STATUS.CONFIRMED}>Confirmed</MenuItem>
                  <MenuItem value={BOOKING_STATUS.PENDING}>Pending</MenuItem>
                  <MenuItem value={BOOKING_STATUS.CANCELLED}>Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchAllBookings}
                disabled={loading}
              >
                Refresh
              </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Typography variant="body2" color="text.secondary">
                Total: {filteredBookings.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PNR</TableCell>
              <TableCell>Passenger</TableCell>
              <TableCell>Train</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.map((booking) => (
              <TableRow key={booking.bookingId} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TicketIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight="medium">
                      {booking.pnrNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {booking.passengerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.passengerEmail}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {booking.trainName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.trainNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {booking.departureStation} → {booking.arrivalStation}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {booking.departureDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.departureTime} - {booking.arrivalTime}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{booking.seatCount}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(booking.totalAmount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.bookingStatus}
                    color={getStatusColor(booking.bookingStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewBooking(booking)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {booking.bookingStatus !== BOOKING_STATUS.CANCELLED && (
                      <>
                        <Tooltip title="Edit Booking">
                          <IconButton
                            size="small"
                            onClick={() => handleEditBooking(booking)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel Booking">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {paginatedBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Booking Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Booking Details - {selectedBooking?.pnrNumber}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Passenger Name
                </Typography>
                <Typography variant="body1">{selectedBooking.passengerName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{selectedBooking.passengerEmail}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{selectedBooking.passengerPhone}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booking Date
                </Typography>
                <Typography variant="body1">{formatDate(selectedBooking.bookingDate)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Train
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.trainName} ({selectedBooking.trainNumber})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedBooking.bookingStatus}
                  color={getStatusColor(selectedBooking.bookingStatus)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Journey Details
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.departureStation} → {selectedBooking.arrivalStation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBooking.departureDate} | {selectedBooking.departureTime} - {selectedBooking.arrivalTime}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Seats
                </Typography>
                <Typography variant="body1">{selectedBooking.seatCount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(selectedBooking.totalAmount)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Booking - {selectedBooking?.pnrNumber}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Passenger Name"
                value={editForm.passengerName}
                onChange={(e) => setEditForm(prev => ({ ...prev, passengerName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editForm.passengerEmail}
                onChange={(e) => setEditForm(prev => ({ ...prev, passengerEmail: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={editForm.passengerPhone}
                onChange={(e) => setEditForm(prev => ({ ...prev, passengerPhone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Seat Count"
                type="number"
                value={editForm.seatCount}
                onChange={(e) => setEditForm(prev => ({ ...prev, seatCount: parseInt(e.target.value) }))}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateBooking} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel booking {selectedBooking?.pnrNumber}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Booking</Button>
          <Button onClick={confirmCancelBooking} color="error" variant="contained" disabled={loading}>
            {loading ? 'Cancelling...' : 'Yes, Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBookingsPage;