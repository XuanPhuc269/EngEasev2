'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Backdrop,
  LinearProgress,
} from '@mui/material';

interface LoadingSpinnerProps {
  /**
   * Type of spinner to display
   * @default 'circular'
   */
  variant?: 'circular' | 'linear' | 'dots';
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Loading message to display
   */
  message?: string;
  /**
   * Whether to show as a full-screen overlay
   * @default false
   */
  fullScreen?: boolean;
  /**
   * Color of the spinner
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'inherit';
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 60,
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'circular',
  size = 'medium',
  message,
  fullScreen = false,
  color = 'primary',
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            <LinearProgress color={color} />
          </Box>
        );
      case 'dots':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: sizeMap[size] / 4,
                  height: sizeMap[size] / 4,
                  borderRadius: '50%',
                  backgroundColor: `${color}.main`,
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: `${index * 0.16}s`,
                  '@keyframes bounce': {
                    '0%, 80%, 100%': {
                      transform: 'scale(0)',
                    },
                    '40%': {
                      transform: 'scale(1)',
                    },
                  },
                }}
              />
            ))}
          </Box>
        );
      default:
        return <CircularProgress size={sizeMap[size]} color={color} />;
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      {renderSpinner()}
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, textAlign: 'center' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Backdrop
        open={true}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        {content}
      </Backdrop>
    );
  }

  return content;
};

export default LoadingSpinner;
