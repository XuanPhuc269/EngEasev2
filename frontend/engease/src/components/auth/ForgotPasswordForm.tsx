'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Email, ArrowBack, CheckCircle } from '@mui/icons-material';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPasswordMutation } from '@/store/api/authApi';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);

    try {
      const result = await forgotPassword(data).unwrap();

      if (result.success) {
        setSubmittedEmail(data.email);
        setIsEmailSent(true);
        onSuccess?.();
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      setServerError(
        err?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
      );
    }
  };

  const handleResendEmail = async () => {
    if (submittedEmail) {
      setServerError(null);
      try {
        await forgotPassword({ email: submittedEmail }).unwrap();
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        setServerError(
          err?.data?.message || 'Không thể gửi lại email. Vui lòng thử lại.'
        );
      }
    }
  };

  // Success state - Email sent
  if (isEmailSent) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 440,
          width: '100%',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        {/* Success Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'success.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
        </Box>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Kiểm tra email của bạn
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{' '}
          <Typography component="span" fontWeight={600} color="text.primary">
            {submittedEmail}
          </Typography>
        </Typography>

        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
          Nếu bạn không nhận được email trong vài phút, hãy kiểm tra thư mục spam hoặc thử lại.
        </Alert>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setServerError(null)}>
            {serverError}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={handleResendEmail}
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Gửi lại email'
          )}
        </Button>

        <Link href="/login" passHref>
          <Button
            fullWidth
            variant="text"
            startIcon={<ArrowBack />}
            sx={{ textTransform: 'none' }}
          >
            Quay lại đăng nhập
          </Button>
        </Link>
      </Paper>
    );
  }

  // Form state
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        maxWidth: 440,
        width: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'primary.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Email sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Quên mật khẩu?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
        </Typography>
      </Box>

      {/* Error Alert */}
      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              placeholder="Nhập email của bạn"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            mb: 2,
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Gửi hướng dẫn'
          )}
        </Button>

        {/* Back to Login Link */}
        <Link href="/login" passHref>
          <Button
            fullWidth
            variant="text"
            startIcon={<ArrowBack />}
            sx={{ textTransform: 'none' }}
          >
            Quay lại đăng nhập
          </Button>
        </Link>
      </Box>
    </Paper>
  );
};

export default ForgotPasswordForm;