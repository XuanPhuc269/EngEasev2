'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { ArrowBack, Edit, Home, Refresh } from '@mui/icons-material';
import { useGetMyProgressQuery, useUpdateTargetScoreMutation } from '@/store/api/progressApi';
import ProgressOverview from '@/components/progress/ProgressOverview';
import SkillChart from '@/components/progress/SkillChart';
import StudyStreak from '@/components/progress/StudyStreak';
import ProgressTimeLine from '@/components/progress/ProgressTimeLine';

const ProgressPage: React.FC = () => {
  const router = useRouter();
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [targetScore, setTargetScore] = useState<number>(7);

  const { data: progressData, isLoading, error, refetch } = useGetMyProgressQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateTarget, { isLoading: updating }] = useUpdateTargetScoreMutation();

  const progress = progressData?.data;

  const handleUpdateTarget = async () => {
    try {
      await updateTarget({ targetScore }).unwrap();
      setTargetDialogOpen(false);
      // Refetch progress data after updating target
      refetch();
    } catch (error) {
      console.error('Failed to update target:', error);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !progress) {
    return (
      <Container>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
          >
            Quay lại
          </Button>
        </Box>
        <Alert severity="info" sx={{ mt: 4 }}>
          Chưa có dữ liệu tiến độ. Hãy hoàn thành bài test đầu tiên để theo dõi tiến độ của bạn!
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/tests')}
          sx={{ mt: 2 }}
        >
          Bắt đầu làm bài test
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
          >
            Quay lại
          </Button>
          <Button
            variant="text"
            startIcon={<Home />}
            onClick={() => router.push('/')}
          >
            Trang chủ
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              My Progress
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your learning journey and achievements
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => {
                setTargetScore(progress.targetScore || 7);
                setTargetDialogOpen(true);
              }}
            >
              Set Target Score
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Overview Stats */}
        <Grid size={{ xs: 12 }}>
          <ProgressOverview progress={progress} />
        </Grid>

        {/* Skills Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <SkillChart progress={progress} />
        </Grid>

        {/* Study Streak */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StudyStreak progress={progress} />
        </Grid>

        {/* Timeline */}
        <Grid size={{ xs: 12 }}>
          <ProgressTimeLine />
        </Grid>
      </Grid>

      {/* Target Score Dialog */}
      <Dialog open={targetDialogOpen} onClose={() => setTargetDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Set Your Target Score</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Target Band Score"
            type="number"
            fullWidth
            value={targetScore}
            onChange={(e) => setTargetScore(Number(e.target.value))}
            inputProps={{ min: 0, max: 9, step: 0.5 }}
            helperText="Choose your target IELTS band score (0-9)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTargetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateTarget} variant="contained" disabled={updating}>
            {updating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProgressPage;
