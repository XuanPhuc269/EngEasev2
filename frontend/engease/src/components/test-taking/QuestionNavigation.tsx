'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  CheckCircle,
  RadioButtonUnchecked,
  Flag,
} from '@mui/icons-material';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  flaggedQuestions?: Set<number>;
  onQuestionSelect: (questionNumber: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  flaggedQuestions = new Set(),
  onQuestionSelect,
  onPrevious,
  onNext,
}) => {
  const isFirst = currentQuestion === 1;
  const isLast = currentQuestion === totalQuestions;

  const getButtonColor = (questionNum: number) => {
    if (questionNum === currentQuestion) return 'primary';
    if (answeredQuestions.has(questionNum)) return 'success';
    return 'default';
  };

  const getButtonVariant = (questionNum: number) => {
    if (questionNum === currentQuestion) return 'contained';
    if (answeredQuestions.has(questionNum)) return 'outlined';
    return 'outlined';
  };

  return (
    <Paper sx={{ p: 2 }}>
      {/* Stats */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Tiến độ
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip
            icon={<CheckCircle />}
            label={`Đã trả lời: ${answeredQuestions.size}/${totalQuestions}`}
            color="success"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<RadioButtonUnchecked />}
            label={`Chưa trả lời: ${totalQuestions - answeredQuestions.size}`}
            variant="outlined"
            size="small"
          />
          {flaggedQuestions.size > 0 && (
            <Chip
              icon={<Flag />}
              label={`Đánh dấu: ${flaggedQuestions.size}`}
              color="warning"
              variant="outlined"
              size="small"
            />
          )}
        </Stack>
      </Box>

      {/* Question Grid */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Các câu hỏi
        </Typography>
        <Grid container spacing={1}>
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
            const isAnswered = answeredQuestions.has(num);
            const isFlagged = flaggedQuestions.has(num);
            const isCurrent = num === currentQuestion;

            return (
              <Grid size={{ xs: 3, sm: 2, md: 3 }} key={num}>
                <Tooltip
                  title={
                    isCurrent
                      ? 'Câu hiện tại'
                      : isAnswered
                      ? 'Đã trả lời'
                      : 'Chưa trả lời'
                  }
                >
                  <Button
                    fullWidth
                    variant={getButtonVariant(num)}
                    color={getButtonColor(num)}
                    onClick={() => onQuestionSelect(num)}
                    sx={{
                      minWidth: 40,
                      position: 'relative',
                      aspectRatio: '1',
                    }}
                  >
                    {num}
                    {isFlagged && (
                      <Flag
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          fontSize: 12,
                          color: 'warning.main',
                        }}
                      />
                    )}
                  </Button>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={onPrevious}
          disabled={isFirst}
          fullWidth
        >
          Trước
        </Button>
        <Button
          variant="contained"
          endIcon={<NavigateNext />}
          onClick={onNext}
          disabled={isLast}
          fullWidth
        >
          Tiếp
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuestionNavigation;