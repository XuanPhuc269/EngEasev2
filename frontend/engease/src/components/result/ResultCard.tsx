'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Stack,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents,
  CheckCircle,
  Cancel,
  AccessTime,
} from '@mui/icons-material';
import { TestResult } from '@/types';
import { formatters } from '@/utils/formatters';

interface ResultCardProps {
  result: TestResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const router = useRouter();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardActionArea onClick={() => router.push(`/results/${result._id}`)}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Test Info */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {result.testId}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatters.formatRelativeTime(result.submittedAt || result.createdAt)}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Thời gian làm bài: {formatters.formatDuration(result.timeSpent || 0)}
              </Typography>
            </Grid>

            {/* Score */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <EmojiEvents color={getScoreColor(result.score)} />
                  <Typography variant="h4" fontWeight={700} color={`${getScoreColor(result.score)}.main`}>
                    {result.score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / 100
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={result.score}
                  color={getScoreColor(result.score)}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </Grid>

            {/* Status & Accuracy */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <Stack spacing={1} alignItems="flex-end">
                <Chip
                  icon={result.isPassed ? <CheckCircle /> : <Cancel />}
                  label={result.isPassed ? 'Đạt' : 'Chưa đạt'}
                  color={result.isPassed ? 'success' : 'error'}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {result.correctAnswers} / {result.answers?.length || 0} câu đúng
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ResultCard;
