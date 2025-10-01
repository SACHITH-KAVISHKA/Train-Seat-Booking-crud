import { useContext } from 'react';
import { BookingContext } from '../context/BookingContext';

/**
 * Custom hook to use booking context
 * @returns {object} Booking context values and functions
 */
export const useBooking = () => {
  const context = useContext(BookingContext);
  
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  
  return context;
};

export default useBooking;