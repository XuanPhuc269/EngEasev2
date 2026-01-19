'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  TrendingUp,
  People,
} from '@mui/icons-material';
import { TestResult } from '@/types';

interface ResultStatsProps {
  results: TestResult[];
  title?: string;
}

const ResultStats: React.FC<ResultStatsProps> = ({ results, title = 'Thống kê' }) => {
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.isPassed).length;
  const averageScore = totalTests > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalTests)
    : 0;

  const stats = [
    {
      label: 'Tổng bài thi',
      value: totalTests,
      icon: <Assignment color="primary" />,
      color: 'primary.main',
    },
    {
      label: 'Đạt yêu cầu',
      value: passedTests,
      icon: <CheckCircle color="success" />,
      color: 'success.main',
      bgcolor: 'success.lighter',
    },
    {
      label: 'Điểm trung bình',
      value: averageScore,
      icon: <TrendingUp color="info" />,
      color: 'info.main',
    },
  ];

  return (
    <Box>
      {title && (
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 4 }} key={index}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: stat.bgcolor }}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                {stat.icon}
                <Typography variant="h4" fontWeight={700} color={stat.color}>
                  {stat.value}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResultStats;
