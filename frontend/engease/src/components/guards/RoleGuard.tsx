'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Block } from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types/auth.types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackUrl?: string;
}

/**
 * Guard component that restricts access based on user roles
 * Shows access denied message if user doesn't have required role
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles,
  fallbackUrl = '/tests'
}) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  // Check if user has one of the allowed roles
  const hasRequiredRole = user && allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
          }}
        >
          <Block
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
            }}
          />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Truy cập bị từ chối
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(fallbackUrl)}
            sx={{
              textTransform: 'none',
              px: 4,
            }}
          >
            Quay lại trang chủ
          </Button>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;