'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Chip, Button } from '@mui/material';
import { Send } from '@mui/icons-material';
import { Question } from '@/types';

interface EssayQuestionProps {
  question: Question;
  answer?: string;
  onAnswerChange?: (answer: string) => void;
  showAnswer?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
}

const EssayQuestion: React.FC<EssayQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
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

  const wordCount = selectedAnswer ? selectedAnswer.trim().split(/\s+/).filter(Boolean).length : 0;
  const minWords = question.type === 'essay' ? 250 : 0;

  return (
    <Box>
      <TextField
        fullWidth
        value={selectedAnswer}
        onChange={handleChange}
        placeholder={
          question.type === 'essay'
            ? 'Viết bài luận của bạn tại đây... (Tối thiểu 250 từ)'
            : 'Ghi âm câu trả lời nói của bạn hoặc viết transcript...'
        }
        disabled={disabled}
        multiline
        rows={12}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'monospace',
            fontSize: '0.95rem',
          },
        }}
      />

      {/* Word Count & Info */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {question.type === 'essay'
            ? 'Luôn gửi ý đến cấu trúc bài viết và ngữ pháp'
            : 'Đối với câu hỏi Speaking, hãy ghi âm và tải lên'}
        </Typography>
        <Chip
          label={`${wordCount} từ${minWords > 0 ? ` / ${minWords}` : ''}`}
          size="small"
          color={wordCount >= minWords ? 'success' : 'default'}
          variant="outlined"
        />
      </Box>

      {question.type === 'essay' && wordCount < minWords && wordCount > 0 && (
        <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
          Bài viết cần thêm {minWords - wordCount} từ để đạt yêu cầu tối thiểu
        </Typography>
      )}
      
      {!disabled && (
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmit}
          disabled={!selectedAnswer.trim() || isSubmitted || (question.type === 'essay' && wordCount < minWords)}
          sx={{ mt: 2 }}
        >
          {isSubmitted ? 'Đã gửi đáp án' : 'Gửi đáp án'}
        </Button>
      )}
    </Box>
  );
};

export default EssayQuestion;