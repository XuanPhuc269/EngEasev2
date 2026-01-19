'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  People,
  Assignment,
  Quiz,
  Assessment,
  TrendingUp,
  School,
} from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  loading,
}) => {
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="rectangular" height={80} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(color, 0.1),
              color: color,
              display: 'flex',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
        </Box>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendingUp
              sx={{
                fontSize: 16,
                mr: 0.5,
                color: trend.isPositive ? 'success.main' : 'error.main',
                transform: trend.isPositive ? 'none' : 'rotate(180deg)',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {trend.value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              so với tháng trước
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Decorative background */}
      <Box
        sx={{
          position: 'absolute',
          right: -20,
          bottom: -20,
          opacity: 0.1,
          transform: 'rotate(-15deg)',
        }}
      >
        {React.cloneElement(icon as React.ReactElement, {
          sx: { fontSize: 100, color: color },
        })}
      </Box>
    </Card>
  );
};

interface DashboardStatsProps {
  stats?: {
    totalUsers: number;
    totalTests: number;
    totalQuestions: number;
    totalResults: number;
    activeUsers?: number;
    completedTests?: number;
    passRate?: number;
    averageScore?: number;
  };
  loading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  const theme = useTheme();

  const statsData = [
    {
      title: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      icon: <People sx={{ fontSize: 32 }} />,
      color: theme.palette.primary.main,
      trend: {
        value: '+12%',
        isPositive: true,
      },
    },
    {
      title: 'Tổng bài test',
      value: stats?.totalTests || 0,
      icon: <Assignment sx={{ fontSize: 32 }} />,
      color: theme.palette.success.main,
      trend: {
        value: '+8%',
        isPositive: true,
      },
    },
    {
      title: 'Tổng câu hỏi',
      value: stats?.totalQuestions || 0,
      icon: <Quiz sx={{ fontSize: 32 }} />,
      color: theme.palette.warning.main,
      trend: {
        value: '+15%',
        isPositive: true,
      },
    },
    {
      title: 'Lượt thi',
      value: stats?.totalResults || 0,
      icon: <Assessment sx={{ fontSize: 32 }} />,
      color: theme.palette.info.main,
      trend: {
        value: '+20%',
        isPositive: true,
      },
    },
  ];

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCard {...stat} loading={loading} />
        </Grid>
      ))}

      {/* Additional Stats */}
      {stats?.activeUsers !== undefined && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Người dùng hoạt động
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {stats.activeUsers} / {stats.totalUsers}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(stats.activeUsers / stats.totalUsers) * 100}%`,
                    bgcolor: 'primary.main',
                    transition: 'width 0.5s',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {stats?.completedTests !== undefined && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 32, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Bài test hoàn thành
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {stats.completedTests}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Tỷ lệ hoàn thành:{' '}
                {((stats.completedTests / stats.totalResults) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default DashboardStats;
