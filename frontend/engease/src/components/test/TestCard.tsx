'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccessTime,
  QuestionAnswer,
  TrendingUp,
  PlayArrow,
  Visibility,
  Edit,
  Delete,
  Headphones,
  MenuBook,
  Create,
  Mic,
} from '@mui/icons-material';
import Link from 'next/link';
import { Test, TestType, Difficulty } from '@/types';
import { formatters } from '@/utils/formatters';

interface TestCardProps {
  test: Test;
  onEdit?: (testId: string) => void;
  onDelete?: (testId: string) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

const TestCard: React.FC<TestCardProps> = ({
  test,
  onEdit,
  onDelete,
  showActions = false,
  variant = 'default',
}) => {
  const getTypeConfig = (type: TestType) => {
    const configs = {
      [TestType.LISTENING]: {
        icon: <Headphones />,
        label: 'Listening',
        color: '#3b82f6',
        bgColor: alpha('#3b82f6', 0.1),
      },
      [TestType.READING]: {
        icon: <MenuBook />,
        label: 'Reading',
        color: '#10b981',
        bgColor: alpha('#10b981', 0.1),
      },
      [TestType.WRITING]: {
        icon: <Create />,
        label: 'Writing',
        color: '#f59e0b',
        bgColor: alpha('#f59e0b', 0.1),
      },
      [TestType.SPEAKING]: {
        icon: <Mic />,
        label: 'Speaking',
        color: '#ef4444',
        bgColor: alpha('#ef4444', 0.1),
      },
      [TestType.FULL_TEST]: {
        icon: <QuestionAnswer />,
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
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Type Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          p: 1,
          borderRadius: 2,
          bgcolor: typeConfig.bgColor,
          color: typeConfig.color,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          zIndex: 1,
        }}
      >
        {React.cloneElement(typeConfig.icon, { sx: { fontSize: 20 } })}
        <Typography variant="caption" fontWeight={600}>
          {typeConfig.label}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 6 }}>
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3.5rem',
          }}
        >
          {test.title}
        </Typography>

        {/* Description */}
        {variant === 'default' && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5rem',
              mb: 2,
            }}
          >
            {test.description}
          </Typography>
        )}

        {/* Tags & Difficulty */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {test.difficulty && (
            <Chip
              label={getDifficultyLabel(test.difficulty)}
              color={getDifficultyColor(test.difficulty)}
              size="small"
            />
          )}
          {!test.isPublished && (
            <Chip label="Chưa xuất bản" size="small" variant="outlined" />
          )}
        </Stack>

        {/* Stats */}
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatters.formatDuration(test.duration)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuestionAnswer sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {test.totalQuestions} câu hỏi
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Điểm đạt: {test.passScore}%
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {showActions ? (
          <Stack direction="row" spacing={1} width="100%">
            <Button
              component={Link}
              href={`/tests/${test._id}`}
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              fullWidth
            >
              Xem
            </Button>
            {onEdit && (
              <Tooltip title="Chỉnh sửa">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(test._id)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Xóa">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(test._id)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} width="100%">
            <Button
              component={Link}
              href={`/tests/${test._id}`}
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              fullWidth
            >
              Chi tiết
            </Button>
            <Button
              component={Link}
              href={`/tests/${test._id}/take`}
              variant="contained"
              size="small"
              startIcon={<PlayArrow />}
              fullWidth
              disabled={!test.isPublished}
            >
              Làm bài
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
};

export default TestCard;