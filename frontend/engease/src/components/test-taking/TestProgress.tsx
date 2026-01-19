'use client';

import React from 'react';
import { Box, LinearProgress, Typography, Paper } from '@mui/material';

interface TestProgressProps {
  current: number;
  total: number;
  answered: number;
}

const TestProgress: React.FC<TestProgressProps> = ({ current, total, answered }) => {
  const progressPercent = (answered / total) * 100;
  const currentPercent = (current / total) * 100;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Câu {current} / {total}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="primary">
          {answered} / {total} đã trả lời
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercent}
        sx={{
          height: 8,
          borderRadius: 1,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            borderRadius: 1,
          },
        }}
      />
    </Paper>
  );
};

export default TestProgress;