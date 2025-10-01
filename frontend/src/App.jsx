import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Toaster } from 'react-hot-toast';

// Context providers
import { BookingProvider } from './context/BookingContext';
import { AppProvider } from './context/AppContext';

// Theme
import { theme } from './theme';

// Components
import Layout from './components/common/Layout';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const ManageBookingsPage = React.lazy(() => import('./pages/ManageBookingsPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader message="Loading..." />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AppProvider>
            <BookingProvider>
                <Router future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true
                }}>
                  <Layout>
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/book/:scheduleId" element={<BookingPage />} />
                        <Route path="/manage-bookings" element={<ManageBookingsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </Layout>
                  
                  {/* Toast notifications */}
                  <Toaster
                    position="top-center"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        borderRadius: '8px',
                        fontFamily: 'Inter, sans-serif',
                      },
                      success: {
                        style: {
                          background: '#22c55e',
                          color: 'white',
                        },
                      },
                      error: {
                        style: {
                          background: '#ef4444',
                          color: 'white',
                        },
                      },
                    }}
                  />
                </Router>
              </BookingProvider>
            </AppProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
