'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Grid } from '@mui/material';
import { LocalFireDepartment, EventAvailable } from '@mui/icons-material';
import { Progress } from '@/types/progress.types';
import { formatters } from '@/utils/formatters';

interface StudyStreakProps {
  progress: Progress;
}

const StudyStreak: React.FC<StudyStreakProps> = ({ progress }) => {
  const getDaysOfWeek = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isStudied: progress.lastStudyDate && new Date(progress.lastStudyDate) >= date,
      });
    }
    
    return days;
  };

  const days = getDaysOfWeek();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LocalFireDepartment sx={{ color: 'warning.main', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            Study Streak
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h2" fontWeight={700} color="warning.main">
            {progress.studyStreak}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            days in a row
          </Typography>
        </Box>

        {/* Weekly Calendar */}
        <Grid container spacing={1}>
          {days.map((day, index) => (
            <Grid key={index} size={{ xs: 12 / 7 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {day.day}
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: day.isStudied ? 'success.main' : 'action.hover',
                    color: day.isStudied ? 'white' : 'text.secondary',
                  }}
                >
                  {day.isStudied ? (
                    <EventAvailable fontSize="small" />
                  ) : (
                    <Typography variant="caption">{day.date.getDate()}</Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {progress.lastStudyDate && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
            Last study: {formatters.formatRelativeTime(progress.lastStudyDate)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyStreak;
