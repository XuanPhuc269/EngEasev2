'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Edit,
  Delete,
  Image,
  Headphones,
  HelpOutline,
} from '@mui/icons-material';
import { Question, QuestionType } from '@/types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import MatchingQuestion from './MatchingQuestion';
import FillInBlankQuestion from './FillInBlankQuestion';
import EssayQuestion from './EssayQuestion';

interface QuestionCardProps {
  question: Question;
  answer?: any;
  onAnswerChange?: (questionId: string, answer: any) => void;
  showAnswer?: boolean;
  showExplanation?: boolean;
  isCorrect?: boolean;
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
  showActions?: boolean;
  disabled?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswerChange,
  showAnswer = false,
  showExplanation = false,
  isCorrect,
  onEdit,
  onDelete,
  showActions = false,
  disabled = false,
}) => {
  const getQuestionTypeLabel = (type: QuestionType) => {
    const labels = {
      [QuestionType.MULTIPLE_CHOICE]: 'Trắc nghiệm',
      [QuestionType.TRUE_FALSE_NOT_GIVEN]: 'True/False/Not Given',
      [QuestionType.MATCHING]: 'Nối cặp',
      [QuestionType.FILL_IN_BLANK]: 'Điền khổng',
      [QuestionType.SHORT_ANSWER]: 'Trả lời ngắn',
      [QuestionType.ESSAY]: 'Tự luận',
      [QuestionType.SPEAKING]: 'Speaking',
    };
    return labels[type];
  };

  const getQuestionTypeColor = (type: QuestionType) => {
    const colors = {
      [QuestionType.MULTIPLE_CHOICE]: 'primary',
      [QuestionType.TRUE_FALSE_NOT_GIVEN]: 'info',
      [QuestionType.MATCHING]: 'success',
      [QuestionType.FILL_IN_BLANK]: 'warning',
      [QuestionType.SHORT_ANSWER]: 'secondary',
      [QuestionType.ESSAY]: 'error',
      [QuestionType.SPEAKING]: 'default',
    } as const;
    return colors[type];
  };

  const renderQuestionContent = () => {
    const commonProps = {
      question,
      answer,
      onAnswerChange: onAnswerChange
        ? (ans: any) => onAnswerChange(question._id, ans)
        : undefined,
      showAnswer,
      isCorrect,
      disabled,
    };

    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return <MultipleChoiceQuestion {...commonProps} />;
      case QuestionType.TRUE_FALSE_NOT_GIVEN:
        return <TrueFalseQuestion {...commonProps} />;
      case QuestionType.MATCHING:
        return <MatchingQuestion {...commonProps} />;
      case QuestionType.FILL_IN_BLANK:
      case QuestionType.SHORT_ANSWER:
        return <FillInBlankQuestion {...commonProps} />;
      case QuestionType.ESSAY:
      case QuestionType.SPEAKING:
        return <EssayQuestion {...commonProps} />;
      default:
        return (
          <Typography color="text.secondary">
            Loại câu hỏi không được hỗ trợ
          </Typography>
        );
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        border: isCorrect !== undefined ? 2 : 0,
        borderColor: isCorrect ? 'success.main' : 'error.main',
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`Câu ${question.questionNumber}`}
              size="small"
              color="primary"
              variant="filled"
            />
            <Chip
              label={getQuestionTypeLabel(question.type)}
              size="small"
              color={getQuestionTypeColor(question.type)}
              variant="outlined"
            />
            <Chip label={`${question.points} điểm`} size="small" variant="outlined" />
            {question.section && (
              <Chip label={question.section} size="small" variant="outlined" />
            )}
          </Stack>

          {showActions && (
            <Stack direction="row" spacing={0.5}>
              {onEdit && (
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(question._id)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Xóa">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(question._id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )}
        </Box>

        {/* Reading Passage */}
        {question.passage ? (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
              📖 Bài đọc:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
              }}
            >
              {question.passage}
            </Typography>
          </Box>
        ) : null}

        {/* Question Text */}
        <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
          {question.question}
        </Typography>

        {/* Media */}
        {(question.imageUrl || question.audioUrl) && (
          <Box sx={{ mb: 2 }}>
            {question.imageUrl && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Image fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Ảnh minh họa
                </Typography>
              </Box>
            )}
            {question.audioUrl && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                <Headphones fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  File nghe
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Question Content */}
        {renderQuestionContent()}

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                p: 2,
                bgcolor: 'info.lighter',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'info.light',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <HelpOutline fontSize="small" color="info" />
                <Typography variant="subtitle2" fontWeight={600} color="info.main">
                  Giải thích
                </Typography>
              </Box>
              <Typography variant="body2">{question.explanation}</Typography>
            </Box>
          </>
        )}

        {/* Correct Answer Display */}
        {showAnswer && question.correctAnswer && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                p: 2,
                bgcolor: 'success.lighter',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'success.light',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} color="success.main">
                Đáp án đúng:
              </Typography>
              <Typography variant="body2">
                {Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.join(', ')
                  : question.correctAnswer}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;