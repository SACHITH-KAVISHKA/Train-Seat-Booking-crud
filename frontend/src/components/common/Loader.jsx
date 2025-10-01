import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Backdrop, Typography, Box } from '@mui/material';

const Loader = ({ 
  open = true, 
  message = 'Loading...', 
  size = 60, 
  color = 'primary',
  backdrop = true,
  fullScreen = false 
}) => {
  if (fullScreen) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
        open={open}
      >
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          gap={2}
        >
          <CircularProgress 
            color={color} 
            size={size}
            thickness={4}
          />
          {message && (
            <Typography 
              variant="body1" 
              component="div"
              sx={{ color: 'white', fontWeight: 500 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Backdrop>
    );
  }

  if (backdrop) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}
        open={open}
      >
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          gap={2}
        >
          <CircularProgress 
            color={color} 
            size={size}
            thickness={4}
          />
          {message && (
            <Typography 
              variant="body1" 
              component="div"
              sx={{ color: 'primary.main', fontWeight: 500 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Backdrop>
    );
  }

  // Inline loader without backdrop
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      p={4}
      gap={2}
    >
      <CircularProgress 
        color={color} 
        size={size}
        thickness={4}
      />
      {message && (
        <Typography 
          variant="body1" 
          component="div"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Skeleton loader component
export const SkeletonLoader = ({ 
  variant = 'rectangular', 
  width = '100%', 
  height = 40,
  count = 1,
  className = '',
  animation = 'pulse'
}) => {
  const items = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton ${className} mb-2 last:mb-0`}
      style={{ 
        width, 
        height: variant === 'circular' ? width : height,
        borderRadius: variant === 'circular' ? '50%' : variant === 'rounded' ? '8px' : '4px'
      }}
    />
  ));

  return <div className="space-y-2">{items}</div>;
};

// Card skeleton loader
export const CardSkeleton = ({ count = 1 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="card p-4 space-y-3">
        <div className="flex items-center space-x-4">
          <div className="skeleton w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
        </div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="flex space-x-4 p-4 bg-gray-100 rounded-lg">
      {Array.from({ length: columns }, (_, index) => (
        <div key={index} className="skeleton h-4 flex-1" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 p-4 border rounded-lg">
        {Array.from({ length: columns }, (_, colIndex) => (
          <div key={colIndex} className="skeleton h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// Page loader component
export const PageLoader = ({ message = 'Loading page...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Button loader component
export const ButtonLoader = ({ size = 20, color = 'inherit' }) => (
  <CircularProgress 
    size={size} 
    color={color}
    thickness={6}
    sx={{ 
      color: color === 'inherit' ? 'inherit' : undefined 
    }}
  />
);

Loader.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success']),
  backdrop: PropTypes.bool,
  fullScreen: PropTypes.bool,
};

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf(['rectangular', 'circular', 'rounded']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
  className: PropTypes.string,
  animation: PropTypes.oneOf(['pulse', 'wave']),
};

CardSkeleton.propTypes = {
  count: PropTypes.number,
};

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
};

PageLoader.propTypes = {
  message: PropTypes.string,
};

ButtonLoader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Loader;