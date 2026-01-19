'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Button } from '@mui/material';
import { CheckCircle, Cancel, Send } from '@mui/icons-material';
import { Question } from '@/types';

interface FillInBlankQuestionProps {
  question: Question;
  answer?: string;
  onAnswerChange?: (answer: string) => void;
  showAnswer?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
}

const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  showAnswer = false,
  isCorrect,
  disabled = false,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(answer || '');
  const [isSubmitted, setIsSubmitted] = useState(!!answer);

  useEffect(() => {
    setSelectedAnswer(answer || '');
    setIsSubmitted(!!answer);
  }, [answer]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedAnswer.trim()) {
      onAnswerChange?.(selectedAnswer);
      setIsSubmitted(true);
    }
  };

  const getColor = () => {
    if (!showAnswer) return undefined;
    return isCorrect ? 'success' : 'error';
  };

  const color = getColor();

  return (
    <Box>
      <TextField
        fullWidth
        value={selectedAnswer}
        onChange={handleChange}
        placeholder="Nhập câu trả lời của bạn..."
        disabled={disabled}
        multiline={question.type === 'short_answer'}
        rows={question.type === 'short_answer' ? 3 : 1}
        error={showAnswer && !isCorrect}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderColor: color ? `${color}.main` : undefined,
            bgcolor: color
              ? color === 'success'
                ? 'success.lighter'
                : 'error.lighter'
              : undefined,
          },
        }}
        InputProps={{
          endAdornment: showAnswer ? (
            isCorrect ? (
              <CheckCircle color="success" />
            ) : (
              <Cancel color="error" />
            )
          ) : null,
        }}
      />

      {/* Hint */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        {question.type === 'short_answer'
          ? 'Viết câu trả lời ngắn gọn'
          : 'Nhập từ hoặc cụm từ phù hợp'}
      </Typography>
      
      {!showAnswer && !disabled && (
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmit}
          disabled={!selectedAnswer.trim() || isSubmitted}
          sx={{ mt: 2 }}
        >
          {isSubmitted ? 'Đã gửi đáp án' : 'Gửi đáp án'}
        </Button>
      )}
    </Box>
  );
};

export default FillInBlankQuestion;