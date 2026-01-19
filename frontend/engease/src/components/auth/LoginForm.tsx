'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { LoginRequest, UserRole } from '@/types';
import { getDefaultRedirectPath } from '@/components/guards';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/tests',
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const result = await login(data as LoginRequest).unwrap();

      // Log để debug
      console.log('Login result:', result);

      if (result.success && result.data) {
        // Lưu tokens
        dispatch(
          setCredentials({
            user: result.data.user,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          })
        );

        // Redirect based on user role
        // Admin/Teacher -> dashboard, Student -> tests (or custom redirectTo)
        const targetPath = 
          result.data.user.role === UserRole.ADMIN || result.data.user.role === UserRole.TEACHER
            ? '/dashboard'
            : redirectTo;
        
        console.log(`Redirecting ${result.data.user.role} to:`, targetPath);
        router.push(targetPath);
        onSuccess?.();
      }
    } catch (error: any) {
      setServerError(error?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

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
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Đăng nhập
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.
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
              sx={{ mb: 2.5 }}
            />
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
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
                      onClick={handleTogglePassword}
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

        {/* Forgot Password Link */}
        <Box sx={{ textAlign: 'right', mb: 3 }}>
          <Link href="/forgot-password" passHref>
            <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Quên mật khẩu?
            </Typography>
          </Link>
        </Box>

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
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Đăng nhập'
          )}
        </Button>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            hoặc đăng nhập với
          </Typography>
        </Divider>

        {/* Social Login Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            disabled={isLoading}
            sx={{
              py: 1.2,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.lighter',
              },
            }}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Facebook />}
            disabled={isLoading}
            sx={{
              py: 1.2,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.lighter',
              },
            }}
          >
            Facebook
          </Button>
        </Box>

        {/* Register Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có tài khoản?{' '}
            <Link href="/register" passHref>
              <Typography
                component="span"
                variant="body2"
                color="primary"
                fontWeight={600}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Đăng ký ngay
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;