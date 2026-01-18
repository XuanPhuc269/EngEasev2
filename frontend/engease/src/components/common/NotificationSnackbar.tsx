'use client';

import React, { forwardRef } from 'react';
import {
  Snackbar,
  Alert as MuiAlert,
  AlertProps,
  AlertTitle,
  IconButton,
  Slide,
  SlideProps,
} from '@mui/material';
import { Close } from '@mui/icons-material';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationSnackbarProps {
  /**
   * Whether the snackbar is open
   */
  open: boolean;
  /**
   * Callback when snackbar is closed
   */
  onClose: () => void;
  /**
   * Message to display
   */
  message: string;
  /**
   * Type/severity of notification
   * @default 'info'
   */
  type?: NotificationType;
  /**
   * Optional title for the alert
   */
  title?: string;
  /**
   * Auto hide duration in milliseconds
   * @default 5000
   */
  autoHideDuration?: number;
  /**
   * Position of the snackbar
   * @default { vertical: 'top', horizontal: 'right' }
   */
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Variant of the alert
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'standard';
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  open,
  onClose,
  message,
  type = 'info',
  title,
  autoHideDuration = 5000,
  position = { vertical: 'top', horizontal: 'right' },
  showCloseButton = true,
  variant = 'filled',
}) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={position}
      TransitionComponent={SlideTransition}
      sx={{
        '& .MuiSnackbar-root': {
          top: { xs: 70, sm: 80 },
        },
      }}
    >
      <Alert
        onClose={showCloseButton ? handleClose : undefined}
        severity={type}
        variant={variant}
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: 450,
          boxShadow: 3,
          '& .MuiAlert-message': {
            flex: 1,
          },
        }}
        action={
          showCloseButton && (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <Close fontSize="small" />
            </IconButton>
          )
        }
      >
        {title && <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;

// Hook for managing notification state
export interface NotificationState {
  open: boolean;
  message: string;
  type: NotificationType;
  title?: string;
}

export const useNotification = () => {
  const [notification, setNotification] = React.useState<NotificationState>({
    open: false,
    message: '',
    type: 'info',
  });

  const showNotification = (
    message: string,
    type: NotificationType = 'info',
    title?: string
  ) => {
    setNotification({ open: true, message, type, title });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const showSuccess = (message: string, title?: string) =>
    showNotification(message, 'success', title);
  const showError = (message: string, title?: string) =>
    showNotification(message, 'error', title);
  const showWarning = (message: string, title?: string) =>
    showNotification(message, 'warning', title);
  const showInfo = (message: string, title?: string) =>
    showNotification(message, 'info', title);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
