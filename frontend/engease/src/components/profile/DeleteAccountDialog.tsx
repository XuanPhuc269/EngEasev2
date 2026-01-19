'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Warning, Visibility, VisibilityOff } from '@mui/icons-material';
import { DeleteAccountRequest } from '@/types';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: DeleteAccountRequest) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onClose,
  onConfirm,
  loading,
  error,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu để xác nhận');
      return;
    }

    try {
      await onConfirm({ password });
      setPassword('');
    } catch (err) {
      // Error handled by parent
    }
  };

  const handleClose = () => {
    setPassword('');
    setPasswordError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'error.main',
        }}
      >
        <Warning />
        Xóa tài khoản vĩnh viễn
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Cảnh báo: Hành động này không thể hoàn tác!
            </Typography>
            <Typography variant="body2">
              Tất cả dữ liệu của bạn bao gồm kết quả thi, tiến độ học tập sẽ bị
              xóa vĩnh viễn.
            </Typography>
          </Alert>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Để xác nhận xóa tài khoản, vui lòng nhập mật khẩu của bạn:
            </Typography>
          </Box>

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu"
            placeholder="Nhập mật khẩu để xác nhận"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
            error={!!passwordError}
            helperText={passwordError}
            disabled={loading}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Xóa tài khoản'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeleteAccountDialog;