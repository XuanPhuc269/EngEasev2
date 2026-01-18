'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Warning,
  Error,
  Info,
  CheckCircle,
  Help,
} from '@mui/icons-material';

type DialogType = 'warning' | 'error' | 'info' | 'success' | 'confirm';

interface ConfirmDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  /**
   * Callback when dialog is closed
   */
  onClose: () => void;
  /**
   * Callback when confirm button is clicked
   */
  onConfirm: () => void;
  /**
   * Dialog title
   */
  title: string;
  /**
   * Dialog content/message
   */
  message: string | React.ReactNode;
  /**
   * Confirm button text
   * @default 'Xác nhận'
   */
  confirmText?: string;
  /**
   * Cancel button text
   * @default 'Hủy'
   */
  cancelText?: string;
  /**
   * Type of dialog - affects icon and color
   * @default 'confirm'
   */
  type?: DialogType;
  /**
   * Whether confirm action is loading
   * @default false
   */
  loading?: boolean;
  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Whether to disable confirm button
   * @default false
   */
  disableConfirm?: boolean;
  /**
   * Max width of dialog
   * @default 'xs'
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

const typeConfig: Record<
  DialogType,
  {
    icon: React.ElementType;
    color: 'warning' | 'error' | 'info' | 'success' | 'primary';
    bgColor: string;
  }
> = {
  warning: {
    icon: Warning,
    color: 'warning',
    bgColor: 'warning.lighter',
  },
  error: {
    icon: Error,
    color: 'error',
    bgColor: 'error.lighter',
  },
  info: {
    icon: Info,
    color: 'info',
    bgColor: 'info.lighter',
  },
  success: {
    icon: CheckCircle,
    color: 'success',
    bgColor: 'success.lighter',
  },
  confirm: {
    icon: Help,
    color: 'primary',
    bgColor: 'primary.lighter',
  },
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'confirm',
  loading = false,
  showCloseButton = true,
  disableConfirm = false,
  maxWidth = 'xs',
}) => {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (!loading && !disableConfirm) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      {showCloseButton && (
        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <Close />
        </IconButton>
      )}

      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: config.bgColor,
            }}
          >
            <IconComponent
              sx={{
                fontSize: 28,
                color: `${config.color}.main`,
              }}
            />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {typeof message === 'string' ? (
          <DialogContentText sx={{ color: 'text.secondary' }}>
            {message}
          </DialogContentText>
        ) : (
          message
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading || disableConfirm}
          variant="contained"
          color={config.color}
          sx={{ minWidth: 100 }}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {loading ? 'Đang xử lý...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
