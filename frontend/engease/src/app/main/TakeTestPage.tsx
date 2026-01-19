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
  Card,
  CardContent,
  Divider,
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
import { TestType } from '@/types';
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

      <Grid container spacing={2}>
        {/* Left Sidebar - Navigation & Progress */}
        <Grid size={{ xs: 12, md: 2.5 }}>
          <Stack spacing={2}>
            {/* Timer */}
            {test.duration && (
              <TestTimer
                duration={test.duration}
                onTimeUp={handleTimeUp}
                isPaused={timeExpired}
              />
            )}

            {/* Progress */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Tiến độ
              </Typography>
              <TestProgress
                current={currentQuestionNumber}
                total={questions.length}
                answered={answeredQuestionsSet.size}
              />
            </Paper>

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

        {/* Middle or Full Width depending on test type */}
        {test.type === TestType.READING ? (
          <>
            {/* Reading Layout - Middle: Passage, Right: Question */}
            {/* Middle - Reading Passage */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2}>
                {/* Time Expired Alert */}
                {timeExpired && (
                  <Alert severity="warning">
                    Hết thời gian! Đang tự động nộp bài...
                  </Alert>
                )}

                {/* Reading Passage */}
                {test.readingPassage && (
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        📖 Đoạn văn Reading
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 1.8,
                          maxHeight: 'calc(100vh - 280px)',
                          overflow: 'auto',
                          pr: 1,
                        }}
                      >
                        {test.readingPassage}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Writing Prompt */}
                {test.writingPrompt && !test.readingPassage && (
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        ✍️ Đề bài Writing
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                        {test.writingPrompt}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Placeholder if no passage */}
                {!test.readingPassage && !test.writingPrompt && (
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Tập trung làm bài
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Grid>

            {/* Right - Question */}
            <Grid size={{ xs: 12, md: 4.5 }}>
              <Stack spacing={2}>
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
                      answer={answers[currentQuestion._id]}
                      onAnswerChange={handleAnswerChange}
                      showAnswer={false}
                      showExplanation={false}
                      disabled={timeExpired || submitting}
                    />
                  </Paper>
                )}

                {/* Navigation Buttons */}
                <Stack direction="row" spacing={2}>
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

                {/* Writing Prompt (if both exist) */}
                {test.writingPrompt && test.readingPassage && (
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        ✍️ Đề bài Writing
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                        {test.writingPrompt}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </Grid>
          </>
        ) : (
          <>
            {/* Listening/Other Layout - Middle: Question, Right: Audio */}
            {/* Middle - Question */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2}>
                {/* Time Expired Alert */}
                {timeExpired && (
                  <Alert severity="warning">
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
                      answer={answers[currentQuestion._id]}
                      onAnswerChange={handleAnswerChange}
                      showAnswer={false}
                      showExplanation={false}
                      disabled={timeExpired || submitting}
                    />
                  </Paper>
                )}

                {/* Navigation Buttons */}
                <Stack direction="row" spacing={2}>
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
              </Stack>
            </Grid>

            {/* Right - Audio Player */}
            <Grid size={{ xs: 12, md: 4.5 }}>
              <Stack spacing={2}>
                {/* Audio Player */}
                {test.audioUrl && (
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        🎧 File nghe
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <audio 
                        controls 
                        style={{ width: '100%', marginBottom: 16 }}
                      >
                        <source src={test.audioUrl} />
                        Trình duyệt của bạn không hỗ trợ phát audio.
                      </audio>
                      <Typography variant="body2" color="text.secondary">
                        Bạn có thể phát lại file nghe nhiều lần. Nghe kỹ để trả lời câu hỏi chính xác.
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Placeholder if no audio */}
                {!test.audioUrl && (
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Không có file nghe
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Grid>
          </>
        )}
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