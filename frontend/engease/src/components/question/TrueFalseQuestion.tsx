'use client';

import React, { useState, useEffect } from 'react';
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button,
  alpha,
} from '@mui/material';
import { CheckCircle, Cancel, Send } from '@mui/icons-material';
import { Question } from '@/types';

interface TrueFalseQuestionProps {
  question: Question;
  answer?: string;
  onAnswerChange?: (answer: string) => void;
  showAnswer?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
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

  const options = ['TRUE', 'FALSE', 'NOT GIVEN'];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswerChange?.(selectedAnswer);
      setIsSubmitted(true);
    }
  };

  const getOptionColor = (option: string) => {
    if (!showAnswer) return undefined;

    const correct = question.correctAnswer === option;
    const selected = answer === option;

    if (correct) return 'success';
    if (selected && !correct) return 'error';
    return undefined;
  };

  const getOptionIcon = (option: string) => {
    if (!showAnswer) return null;

    const correct = question.correctAnswer === option;
    const selected = answer === option;

    if (correct) return <CheckCircle color="success" fontSize="small" />;
    if (selected && !correct) return <Cancel color="error" fontSize="small" />;
    return null;
  };

  return (
    <FormControl component="fieldset" fullWidth disabled={disabled}>
      <RadioGroup value={selectedAnswer} onChange={handleChange}>
        {options.map((option) => {
          const color = getOptionColor(option);
          const icon = getOptionIcon(option);

          return (
            <Box
              key={option}
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: color
                  ? `${color}.main`
                  : selectedAnswer === option
                  ? 'primary.main'
                  : 'divider',
                bgcolor: color
                  ? alpha(
                      color === 'success'
                        ? '#10b981'
                        : color === 'error'
                        ? '#ef4444'
                        : '#000',
                      0.05
                    )
                  : selectedAnswer === option
                  ? 'action.selected'
                  : 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: disabled
                    ? undefined
                    : color
                    ? alpha(
                        color === 'success'
                          ? '#10b981'
                          : color === 'error'
                          ? '#ef4444'
                          : '#000',
                        0.1
                      )
                    : 'action.hover',
                },
              }}
            >
              <FormControlLabel
                value={option}
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      gap: 1,
                    }}
                  >
                    <span>{option}</span>
                    {icon}
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </Box>
          );
        })}
      </RadioGroup>
      
      {!showAnswer && !disabled && (
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmit}
          disabled={!selectedAnswer || isSubmitted}
          sx={{ mt: 2 }}
        >
          {isSubmitted ? 'Đã gửi đáp án' : 'Gửi đáp án'}
        </Button>
      )}
    </FormControl>
  );
};

export default TrueFalseQuestion;