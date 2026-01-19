'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Send,
  Flag,
  ArrowBack,
  FlagOutlined,
} from '@mui/icons-material';
import { useGetTestByIdQuery } from '@/store/api/testApi';
import { useGetQuestionsByTestIdQuery } from '@/store/api/questionApi';
import { useSubmitTestMutation } from '@/store/api/resultApi';
import {
  TestTimer,
  TestProgress,
  QuestionNavigation,
  SubmitTestDialog,
} from '@/components/test-taking';
import { QuestionCard } from '@/components/question';
import { Answer } from '@/types';

interface TakeTestPageProps {
  testId: string;
}

const TakeTestPage: React.FC<TakeTestPageProps> = ({ testId }) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [startedAt] = useState<string>(new Date().toISOString());
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  // API queries
  const { data: testData, isLoading: testLoading } = useGetTestByIdQuery(testId);
  const { data: questionsData, isLoading: questionsLoading } = useGetQuestionsByTestIdQuery(testId);
  const [submitTest, { isLoading: submitting }] = useSubmitTestMutation();

  const isLoading = testLoading || questionsLoading;
  
  // Extract data from API responses
  const test = testData?.data;
  const questions = questionsData?.data || [];

  // Current question
  const currentQuestion = questions?.[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;

  // Answered questions tracking
  const answeredQuestionsSet = useMemo(() => {
    const set = new Set<number>();
    questions?.forEach((q, idx) => {
      if (answers[q._id]) {
        set.add(idx + 1);
      }
    });
    return set;
  }, [answers, questions]);

  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Handle flag toggle
  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionNumber)) {
        newSet.delete(currentQuestionNumber);
      } else {
        newSet.add(currentQuestionNumber);
      }
      return newSet;
    });
  };

  // Navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionSelect = (questionNumber: number) => {
    setCurrentQuestionIndex(questionNumber - 1);
  };

  // Submit test
  const handleSubmitTest = async () => {
    if (!test || !questions) return;

    const timeSpent = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);

    const submissionAnswers: Answer[] = questions.map((q) => ({
      questionId: q._id,
      userAnswer: answers[q._id] || '',
    }));

    try {
      const result = await submitTest({
        testId: test._id,
        answers: submissionAnswers,
        timeSpent,
        startedAt,
      }).unwrap();

      // Redirect to result page
      router.push(`/results/${result.data._id}`);
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

  // Auto-submit when time expires
  useEffect(() => {
    if (timeExpired) {
      handleSubmitTest();
    }
  }, [timeExpired]);

  // Handle time up
  const handleTimeUp = () => {
    setTimeExpired(true);
  };

  // Prevent navigation away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!timeExpired) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [timeExpired]);

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!test || !questions || questions.length === 0) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Không tìm thấy bài thi hoặc bài thi không có câu hỏi.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => router.push(`/tests/${testId}`)}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {test.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {test.type} • {test.difficulty}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<Send />}
            onClick={() => setSubmitDialogOpen(true)}
            disabled={submitting || timeExpired}
          >
            Nộp bài
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Progress */}
          <TestProgress
            current={currentQuestionNumber}
            total={questions.length}
            answered={answeredQuestionsSet.size}
          />

          {/* Time Expired Alert */}
          {timeExpired && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Hết thời gian! Đang tự động nộp bài...
            </Alert>
          )}

          {/* Question */}
          {currentQuestion && (
            <Paper sx={{ p: 3, position: 'relative' }}>
              {/* Flag Button */}
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title={flaggedQuestions.has(currentQuestionNumber) ? 'Bỏ đánh dấu' : 'Đánh dấu câu hỏi'}>
                  <IconButton
                    onClick={handleToggleFlag}
                    color={flaggedQuestions.has(currentQuestionNumber) ? 'warning' : 'default'}
                  >
                    {flaggedQuestions.has(currentQuestionNumber) ? <Flag /> : <FlagOutlined />}
                  </IconButton>
                </Tooltip>
              </Box>

              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionNumber}
                userAnswer={answers[currentQuestion._id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQuestion._id, answer)}
                showExplanation={false}
                isReview={false}
              />
            </Paper>
          )}

          {/* Navigation Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              fullWidth
            >
              Câu trước
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              fullWidth
            >
              Câu tiếp
            </Button>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {/* Timer */}
            {test.duration && (
              <TestTimer
                duration={test.duration}
                onTimeUp={handleTimeUp}
                isPaused={timeExpired}
              />
            )}

            {/* Question Navigation */}
            <QuestionNavigation
              totalQuestions={questions.length}
              currentQuestion={currentQuestionNumber}
              answeredQuestions={answeredQuestionsSet}
              flaggedQuestions={flaggedQuestions}
              onQuestionSelect={handleQuestionSelect}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </Stack>
        </Grid>
      </Grid>

      {/* Submit Dialog */}
      <SubmitTestDialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        onConfirm={handleSubmitTest}
        totalQuestions={questions.length}
        answeredQuestions={answeredQuestionsSet.size}
        loading={submitting}
      />
    </Container>
  );
};

export default TakeTestPage;