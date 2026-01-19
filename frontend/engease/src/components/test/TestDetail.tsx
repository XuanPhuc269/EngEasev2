'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
  Grid,
  Paper,
  Avatar,
  alpha,
} from '@mui/material';
import {
  PlayArrow,
  AccessTime,
  QuestionAnswer,
  TrendingUp,
  Person,
  CalendarToday,
  Edit,
  Headphones,
  MenuBook,
  Create,
  Mic,
  CheckCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import { Test, TestType, Difficulty } from '@/types';
import { formatters } from '@/utils/formatters';

interface TestDetailProps {
  test: Test;
  onEdit?: () => void;
  canEdit?: boolean;
}

const TestDetail: React.FC<TestDetailProps> = ({ test, onEdit, canEdit = false }) => {
  const getTypeConfig = (type: TestType) => {
    const configs = {
      [TestType.LISTENING]: {
        icon: <Headphones sx={{ fontSize: 40 }} />,
        label: 'Listening',
        color: '#3b82f6',
        bgColor: alpha('#3b82f6', 0.1),
      },
      [TestType.READING]: {
        icon: <MenuBook sx={{ fontSize: 40 }} />,
        label: 'Reading',
        color: '#10b981',
        bgColor: alpha('#10b981', 0.1),
      },
      [TestType.WRITING]: {
        icon: <Create sx={{ fontSize: 40 }} />,
        label: 'Writing',
        color: '#f59e0b',
        bgColor: alpha('#f59e0b', 0.1),
      },
      [TestType.SPEAKING]: {
        icon: <Mic sx={{ fontSize: 40 }} />,
        label: 'Speaking',
        color: '#ef4444',
        bgColor: alpha('#ef4444', 0.1),
      },
      [TestType.FULL_TEST]: {
        icon: <QuestionAnswer sx={{ fontSize: 40 }} />,
        label: 'Full Test',
        color: '#8b5cf6',
        bgColor: alpha('#8b5cf6', 0.1),
      },
    };
    return configs[type];
  };

  const getDifficultyColor = (difficulty?: Difficulty) => {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return 'success';
      case Difficulty.INTERMEDIATE:
        return 'warning';
      case Difficulty.ADVANCED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getDifficultyLabel = (difficulty?: Difficulty) => {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return 'Cơ bản';
      case Difficulty.INTERMEDIATE:
        return 'Trung bình';
      case Difficulty.ADVANCED:
        return 'Nâng cao';
      default:
        return '';
    }
  };

  const typeConfig = getTypeConfig(test.type);

  return (
    <Box>
      {/* Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Left: Type Icon */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  borderRadius: 2,
                  bgcolor: typeConfig.bgColor,
                  color: typeConfig.color,
                }}
              >
                {typeConfig.icon}
              </Box>
            </Grid>

            {/* Center: Test Info */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {test.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label={typeConfig.label} color="primary" size="small" />
                    {test.difficulty && (
                      <Chip
                        label={getDifficultyLabel(test.difficulty)}
                        color={getDifficultyColor(test.difficulty)}
                        size="small"
                      />
                    )}
                    {test.isPublished ? (
                      <Chip
                        icon={<CheckCircle />}
                        label="Đã xuất bản"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip label="Chưa xuất bản" variant="outlined" size="small" />
                    )}
                  </Stack>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  {test.description}
                </Typography>

                {/* Tags */}
                {test.tags && test.tags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {test.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                )}
              </Stack>
            </Grid>

            {/* Right: Actions */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Stack spacing={2}>
                <Button
                  component={Link}
                  href={`/tests/${test._id}/take`}
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  fullWidth
                  disabled={!test.isPublished}
                >
                  Làm bài thi
                </Button>
                {canEdit && onEdit && (
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Edit />}
                    onClick={onEdit}
                    fullWidth
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column: Stats & Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Stats */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Thông tin bài thi
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 3 }}>
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
                      <AccessTime sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {formatters.formatDuration(test.duration)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
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
                      <QuestionAnswer sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {test.totalQuestions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Câu hỏi
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
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
                      <TrendingUp sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {test.passScore}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Điểm đạt
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
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
                      <QuestionAnswer sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {test.questions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Đã thêm
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Meta Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Creator Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Người tạo
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {test.createdBy.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {test.createdBy.email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Date Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Thông tin khác
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Ngày tạo
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatters.formatDate(test.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Cập nhật
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatters.formatDate(test.updatedAt)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestDetail;