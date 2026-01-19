'use client';

import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { useGetDashboardStatsQuery } from '@/store/api/dashboardApi';
import { formatters } from '@/utils/formatters';

const DashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">
          Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.
        </Alert>
      </Box>
    );
  }

  const stats = dashboardData ? {
    totalUsers: dashboardData.users.total,
    totalTests: dashboardData.tests.total,
    totalQuestions: dashboardData.questions.total,
    totalResults: dashboardData.results.total,
    activeUsers: dashboardData.users.active,
    completedTests: dashboardData.results.total,
    passRate: dashboardData.results.passRate,
    averageScore: dashboardData.results.averageScore,
  } : null;

  const recentActivities = dashboardData?.recentActivity.results.map((result) => ({
    id: result._id,
    user: result.userId?.name || 'Người dùng',
    action: 'đã hoàn thành bài test',
    test: result.testId?.title || 'Bài test',
    score: result.score,
    isPassed: result.isPassed,
    time: formatters.formatRelativeTime(result.createdAt),
  })) || [];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tổng quan hệ thống EngEase
        </Typography>
      </Box>

      {/* Stats */}
      {stats && (
        <Box sx={{ mb: 4 }}>
          <DashboardStats stats={stats} />
        </Box>
      )}

      {/* Quick Actions & Recent Activities */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Hoạt động gần đây
              </Typography>
              {recentActivities.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Chưa có hoạt động nào
                </Typography>
              ) : (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {recentActivities.map((activity) => (
                    <Box
                      key={activity.id}
                      sx={{
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        borderLeft: 3,
                        borderColor: activity.isPassed ? 'success.main' : 'warning.main',
                      }}
                    >
                      <Typography variant="body2">
                        <strong>{activity.user}</strong> {activity.action}
                        {activity.test && (
                          <>
                            {' '}
                            <em>"{activity.test}"</em>
                          </>
                        )}
                        {activity.score !== undefined && (
                          <Typography
                            component="span"
                            sx={{
                              ml: 1,
                              fontWeight: 600,
                              color: activity.isPassed ? 'success.main' : 'warning.main',
                            }}
                          >
                            ({activity.score} điểm)
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;