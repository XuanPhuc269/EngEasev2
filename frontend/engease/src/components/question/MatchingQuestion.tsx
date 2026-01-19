'use client';

import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { Question } from '@/types';

interface MatchingQuestionProps {
  question: Question;
  answer?: Record<string, string>;
  onAnswerChange?: (answer: Record<string, string>) => void;
  showAnswer?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  answer = {},
  onAnswerChange,
  showAnswer = false,
  disabled = false,
}) => {
  // Assume question.options contains pairs: [{ text: "A. Item 1", isCorrect: true }, ...]
  // And correctAnswer is a JSON string like {"A": "1", "B": "2"}
  const leftItems = question.options?.filter((_, i) => i % 2 === 0) || [];
  const rightItems = question.options?.filter((_, i) => i % 2 === 1) || [];

  const handleChange = (leftItem: string, rightItem: string) => {
    const newAnswer = { ...answer, [leftItem]: rightItem };
    onAnswerChange?.(newAnswer);
  };

  const isItemCorrect = (leftItem: string) => {
    if (!showAnswer || !question.correctAnswer) return undefined;
    try {
      const correctAnswers =
        typeof question.correctAnswer === 'string'
          ? JSON.parse(question.correctAnswer)
          : question.correctAnswer;
      return correctAnswers[leftItem] === answer[leftItem];
    } catch {
      return undefined;
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Nối mỗi mục ở cột trái với mục tương ứng ở cột phải
      </Typography>

      <Grid container spacing={2}>
        {leftItems.map((item, index) => {
          const itemCorrect = isItemCorrect(item.text);

          return (
            <Grid size={{ xs: 12 }} key={index}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid',
                  borderColor: showAnswer
                    ? itemCorrect
                      ? 'success.main'
                      : 'error.main'
                    : 'divider',
                  bgcolor: showAnswer
                    ? itemCorrect
                      ? 'success.lighter'
                      : 'error.lighter'
                    : 'background.paper',
                }}
              >
                {/* Left Item */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.text}
                  </Typography>
                </Box>

                {/* Arrow */}
                <Typography variant="h6" color="text.secondary">
                  →
                </Typography>

                {/* Right Item Select */}
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth size="small" disabled={disabled}>
                    <Select
                      value={answer[item.text] || ''}
                      onChange={(e) => handleChange(item.text, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Chọn đáp án</em>
                      </MenuItem>
                      {rightItems.map((rightItem, i) => (
                        <MenuItem key={i} value={rightItem.text}>
                          {rightItem.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Indicator */}
                {showAnswer && (
                  <Box>
                    {itemCorrect ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Cancel color="error" />
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MatchingQuestion;