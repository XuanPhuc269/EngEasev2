'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { AccessTime, Warning } from '@mui/icons-material';

interface TestTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  isPaused?: boolean;
}

const TestTimer: React.FC<TestTimerProps> = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const totalSeconds = duration * 60;

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / totalSeconds) * 100;
  const isWarning = timeLeft <= 300; // Last 5 minutes
  const isCritical = timeLeft <= 60; // Last minute

  const getColor = () => {
    if (isCritical) return 'error';
    if (isWarning) return 'warning';
    return 'primary';
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        position: 'sticky',
        top: 16,
        border: '2px solid',
        borderColor: isCritical
          ? 'error.main'
          : isWarning
          ? 'warning.main'
          : 'divider',
        bgcolor: isCritical
          ? 'error.lighter'
          : isWarning
          ? 'warning.lighter'
          : 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {(isWarning || isCritical) && (
          <Warning color={getColor()} sx={{ animation: 'pulse 1s infinite' }} />
        )}
        <AccessTime color={getColor()} />
        <Typography variant="subtitle2" fontWeight={600} color={`${getColor()}.main`}>
          Thời gian còn lại
        </Typography>
      </Box>

      <Typography
        variant="h4"
        fontWeight={700}
        color={`${getColor()}.main`}
        sx={{ mb: 1, fontFamily: 'monospace' }}
      >
        {formatTime(timeLeft)}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        color={getColor()}
        sx={{ height: 8, borderRadius: 1 }}
      />

      {isWarning && (
        <Typography variant="caption" color={`${getColor()}.main`} sx={{ mt: 1, display: 'block' }}>
          {isCritical ? 'Sắp hết giờ!' : 'Sắp hết thời gian!'}
        </Typography>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Paper>
  );
};

export default TestTimer;