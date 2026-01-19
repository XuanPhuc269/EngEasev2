'use client';

import React from 'react';
import { Card, CardContent, Grid, Box, Typography, LinearProgress, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Assessment, Timer, EmojiEvents } from '@mui/icons-material';
import { Progress } from '@/types/progress.types';

interface ProgressOverviewProps {
  progress: Progress;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ progress }) => {
  // Safeguard against undefined fields coming from API
  const overallBandScore = Number(progress?.overallBandScore ?? 0);
  const totalTestsCompleted = Number(progress?.totalTestsCompleted ?? 0);
  const totalTimeSpent = Number(progress?.totalTimeSpent ?? 0);
  const studyStreak = Number(progress?.studyStreak ?? 0);
  const targetScore = progress?.targetScore;
  const progressToTarget = Number(progress?.progressToTarget ?? 0);
  const strengths = Array.isArray(progress?.strengths) ? progress.strengths : [];
  const weaknesses = Array.isArray(progress?.weaknesses) ? progress.weaknesses : [];
  const recentActivity = Array.isArray(progress?.recentActivity) ? progress.recentActivity : [];

  const stats = [
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />,
      label: 'Overall Band Score',
      value: overallBandScore.toFixed(1),
      color: 'primary',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'warning.main' }} />,
      label: 'Tests Completed',
      value: totalTestsCompleted,
      color: 'warning',
    },
    {
      icon: <Timer sx={{ fontSize: 40, color: 'info.main' }} />,
      label: 'Total Time',
      value: `${Math.round(totalTimeSpent / 60)}h`,
      color: 'info',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      label: 'Study Streak',
      value: `${studyStreak} days`,
      color: 'success',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'success';
    if (score >= 5.5) return 'info';
    if (score >= 4) return 'warning';
    return 'error';
  };

  return (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      {stats.map((stat, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                {stat.icon}
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {stat.label}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Target Score Progress */}
      {targetScore != null && (
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Target Score Progress
                </Typography>
                <Chip
                  label={`${overallBandScore.toFixed(1)} / ${targetScore}`}
                  color={getScoreColor(overallBandScore)}
                  size="small"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={Number.isFinite(progressToTarget) ? Math.max(0, Math.min(100, progressToTarget)) : 0}
                sx={{ height: 8, borderRadius: 1 }}
                color={getScoreColor(overallBandScore)}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {Number.isFinite(progressToTarget) ? `${progressToTarget.toFixed(0)}% to target` : '0% to target'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Strengths & Weaknesses */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUp color="success" />
              <Typography variant="h6" fontWeight={600}>
                Strengths
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {strengths.length > 0 ? (
                strengths.map((strength, index) => (
                  <Chip key={index} label={strength} color="success" variant="outlined" size="small" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Complete more tests to identify your strengths
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingDown color="error" />
              <Typography variant="h6" fontWeight={600}>
                Areas to Improve
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {weaknesses.length > 0 ? (
                weaknesses.map((weakness, index) => (
                  <Chip key={index} label={weakness} color="error" variant="outlined" size="small" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Complete more tests to identify areas to improve
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EmojiEvents color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Recent Activity
              </Typography>
            </Box>
            {recentActivity.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No recent tests yet. Complete a test to see activity here.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {recentActivity.map((activity, index) => (
                  <Box
                    key={`${activity.testTitle}-${index}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {activity.testTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${activity.score}`}
                      color={activity.isPassed ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProgressOverview;
