'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResetPasswordMutation } from '@/store/api/authApi';

// Validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Mật khẩu là bắt buộc')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
      ),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
}

// Password strength calculator
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length >= 6) strength += 20;
  if (password.length >= 8) strength += 10;
  if (password.length >= 12) strength += 10;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
  if (/[^a-zA-Z\d]/.test(password)) strength += 15;

  return Math.min(strength, 100);
};

const getStrengthLabel = (strength: number): { label: string; color: string } => {
  if (strength < 30) return { label: 'Yếu', color: 'error' };
  if (strength < 60) return { label: 'Trung bình', color: 'warning' };
  if (strength < 80) return { label: 'Khá', color: 'info' };
  return { label: 'Mạnh', color: 'success' };
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token: propToken,
  onSuccess,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = propToken || searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Watch password for strength indicator
  const watchPassword = watch('password');
  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watchPassword || ''));
  }, [watchPassword]);

  const strengthInfo = getStrengthLabel(passwordStrength);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setServerError('Token không hợp lệ. Vui lòng thử lại từ email.');
      return;
    }

    setServerError(null);

    try {
      const result = await resetPassword({
        token,
        password: data.password,
      }).unwrap();

      if (result.success) {
        setIsSuccess(true);
        onSuccess?.();

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      setServerError(
        err?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
      );
    }
  };

  // No token state
  if (!token) {
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
        <Alert severity="error" sx={{ mb: 3 }}>
          Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </Alert>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Vui lòng yêu cầu link mới để đặt lại mật khẩu.
        </Typography>

        <Link href="/forgot-password" passHref>
          <Button variant="contained" fullWidth sx={{ mb: 2 }}>
            Yêu cầu link mới
          </Button>
        </Link>

        <Link href="/login" passHref>
          <Button
            variant="text"
            fullWidth
            startIcon={<ArrowBack />}
            sx={{ textTransform: 'none' }}
          >
            Quay lại đăng nhập
          </Button>
        </Link>
      </Paper>
    );
  }

  // Success state
  if (isSuccess) {
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
          Đặt lại mật khẩu thành công!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển đến trang đăng nhập trong giây lát.
        </Typography>

        <Link href="/login" passHref>
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Đăng nhập ngay
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
          <Lock sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Đặt lại mật khẩu
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nhập mật khẩu mới cho tài khoản của bạn.
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
        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
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
              sx={{ mb: 1 }}
            />
          )}
        />

        {/* Password Strength Indicator */}
        {watchPassword && (
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                color={strengthInfo.color as 'error' | 'warning' | 'info' | 'success'}
                sx={{ flex: 1, height: 6, borderRadius: 3 }}
              />
              <Typography
                variant="caption"
                color={`${strengthInfo.color}.main`}
                fontWeight={600}
              >
                {strengthInfo.label}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
            </Typography>
          </Box>
        )}

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu mới"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
            'Đặt lại mật khẩu'
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

export default ResetPasswordForm;