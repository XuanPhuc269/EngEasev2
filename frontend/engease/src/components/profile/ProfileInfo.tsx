'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Email,
  Stars,
  TrendingUp,
  CalendarToday,
  Verified,
  Lock,
} from '@mui/icons-material';
import { User, UserRole } from '@/types';
import { formatters } from '@/utils/formatters';

interface ProfileInfoProps {
  user: User;
  onEditClick: () => void;
  onChangePasswordClick: () => void;
  loading?: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  user,
  onEditClick,
  onChangePasswordClick,
  loading,
}) => {
  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      [UserRole.ADMIN]: { label: 'Quản trị viên', color: 'error' as const },
      [UserRole.TEACHER]: { label: 'Giáo viên', color: 'primary' as const },
      [UserRole.STUDENT]: { label: 'Học viên', color: 'success' as const },
    };
    return roleConfig[role];
  };

  const roleConfig = getRoleBadge(user.role);

  return (
    <Card>
      <CardContent>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Avatar */}
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid',
              borderColor: 'primary.main',
              fontSize: '3rem',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>

          {/* User Info */}
          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                mb: 1,
              }}
            >
              <Typography variant="h4" fontWeight={700}>
                {user.name}
              </Typography>
              {user.isEmailVerified && (
                <Tooltip title="Email đã xác thực">
                  <Verified color="primary" />
                </Tooltip>
              )}
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
              <Chip
                label={roleConfig.label}
                color={roleConfig.color}
                size="small"
              />
              {user.currentLevel && (
                <Chip
                  label={user.currentLevel}
                  variant="outlined"
                  size="small"
                />
              )}
            </Stack>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Email fontSize="small" />
              <Typography variant="body2">{user.email}</Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack spacing={1}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={onEditClick}
              disabled={loading}
              sx={{ minWidth: 140 }}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outlined"
              startIcon={<Lock />}
              onClick={onChangePasswordClick}
              disabled={loading}
              sx={{ minWidth: 140 }}
            >
              Đổi mật khẩu
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Stats Grid */}
        <Grid container spacing={3}>
          {/* Target Score */}
          {user.targetScore && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  <Stars sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  {user.targetScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mục tiêu điểm
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Current Level */}
          {user.currentLevel && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'success.lighter',
                    color: 'success.main',
                    mb: 1,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  {user.currentLevel}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trình độ hiện tại
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Member Since */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'info.lighter',
                  color: 'info.main',
                  mb: 1,
                }}
              >
                <CalendarToday sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                {formatters.formatDate(new Date(user.createdAt))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngày tham gia
              </Typography>
            </Box>
          </Grid>

          {/* Last Login */}
          {user.lastLogin && (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'warning.lighter',
                    color: 'warning.main',
                    mb: 1,
                  }}
                >
                  <CalendarToday sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {formatters.formatDate(new Date(user.lastLogin))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đăng nhập gần nhất
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;