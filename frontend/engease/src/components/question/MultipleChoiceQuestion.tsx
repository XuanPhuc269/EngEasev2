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

interface MultipleChoiceQuestionProps {
  question: Question;
  answer?: string;
  onAnswerChange?: (answer: string) => void;
  showAnswer?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
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
    if (selectedAnswer) {
      onAnswerChange?.(selectedAnswer);
      setIsSubmitted(true);
    }
  };

  const isOptionCorrect = (optionText: string) => {
    return question.options?.find((opt) => opt.text === optionText)?.isCorrect;
  };

  const getOptionColor = (optionText: string) => {
    if (!showAnswer) return undefined;

    const correct = isOptionCorrect(optionText);
    const selected = answer === optionText;

    if (correct) return 'success';
    if (selected && !correct) return 'error';
    return undefined;
  };

  const getOptionIcon = (optionText: string) => {
    if (!showAnswer) return null;

    const correct = isOptionCorrect(optionText);
    const selected = answer === optionText;

    if (correct) return <CheckCircle color="success" fontSize="small" />;
    if (selected && !correct) return <Cancel color="error" fontSize="small" />;
    return null;
  };

  return (
    <FormControl component="fieldset" fullWidth disabled={disabled}>
      <RadioGroup value={selectedAnswer} onChange={handleChange}>
        {question.options?.map((option, index) => {
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
          const color = getOptionColor(option.text);
          const icon = getOptionIcon(option.text);

          return (
            <Box
              key={index}
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: color
                  ? `${color}.main`
                  : selectedAnswer === option.text
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
                  : selectedAnswer === option.text
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
                value={option.text}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 600,
                          minWidth: 24,
                          color: color ? `${color}.main` : undefined,
                        }}
                      >
                        {optionLabel}.
                      </Box>
                      <span>{option.text}</span>
                    </Box>
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

export default MultipleChoiceQuestion;