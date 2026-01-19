'use client';

import React, { useState } from 'react';
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
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  CheckCircle,
  Cancel,
  ExpandMore,
  AccessTime,
  TrendingUp,
  EmojiEvents,
} from '@mui/icons-material';
import { useGetTestResultQuery } from '@/store/api/resultApi';
import { useGetTestByIdQuery } from '@/store/api/testApi';
import { useGetQuestionsByTestIdQuery } from '@/store/api/questionApi';
import { QuestionCard } from '@/components/question';
import { formatters } from '@/utils/formatters';

interface ResultDetailPageProps {
  resultId: string;
}

const ResultDetailPage: React.FC<ResultDetailPageProps> = ({ resultId }) => {
  const router = useRouter();
  const [expandedQuestion, setExpandedQuestion] = useState<string | false>(false);

  // API queries
  const { data: resultData, isLoading: resultLoading, error: resultError } = useGetTestResultQuery(resultId);
  const result = resultData?.data;
  const { data: testData, isLoading: testLoading } = useGetTestByIdQuery(result?.testId || '', {
    skip: !result?.testId,
  });
  const test = testData?.data;
  const { data: questionsData, isLoading: questionsLoading } = useGetQuestionsByTestIdQuery(result?.testId || '', {
    skip: !result?.testId,
  });
  const questions = questionsData?.data || [];

  const isLoading = resultLoading || testLoading || questionsLoading;

  const handleAccordionChange = (questionId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedQuestion(isExpanded ? questionId : false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (resultError || !result) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Không tìm thấy kết quả bài thi.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => router.push('/results')}
          sx={{ mt: 2 }}
        >
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => router.push(`/tests/${result.testId}`)}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Kết quả bài thi
            </Typography>
            {test && (
              <Typography variant="body1" color="text.secondary">
                {test.title}
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => router.push(`/tests/${result.testId}/take`)}
          >
            Làm lại
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Score Overview */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                {/* Score Circle */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={180}
                        thickness={4}
                        sx={{ color: 'action.hover' }}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={result.score}
                        size={180}
                        thickness={4}
                        color={getScoreColor(result.score)}
                        sx={{
                          position: 'absolute',
                          left: 0,
                          transform: 'rotate(-90deg) !important',
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography variant="h2" fontWeight={700} color={`${getScoreColor(result.score)}.main`}>
                          {result.score}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          / 100
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Stats */}
                <Grid size={{ xs: 12, md: 9 }}>
                  <Grid container spacing={2}>
                    {/* Pass/Fail Status */}
                    <Grid size={{ xs: 12 }}>
                      <Alert
                        severity={result.isPassed ? 'success' : 'error'}
                        icon={result.isPassed ? <CheckCircle /> : <Cancel />}
                        sx={{ fontWeight: 600 }}
                      >
                        {result.isPassed ? 'Đạt yêu cầu' : 'Chưa đạt yêu cầu'}
                      </Alert>
                    </Grid>

                    {/* Correct Answers */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                          <CheckCircle color="success" />
                          <Typography variant="h5" fontWeight={700} color="success.main">
                            {result.correctAnswers}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Câu đúng
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Total Questions */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                          <EmojiEvents color="primary" />
                          <Typography variant="h5" fontWeight={700}>
                            {result.answers?.length || 0}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Tổng câu hỏi
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Time Spent */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                          <AccessTime color="info" />
                          <Typography variant="h5" fontWeight={700}>
                            {formatters.formatDuration(result.timeSpent || 0)}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Thời gian làm bài
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Date */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary">
                        Hoàn thành lúc: {formatters.formatDateTime(result.submittedAt || result.createdAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Questions Review */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Chi tiết câu trả lời
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {questions?.map((question, index) => {
                const answer = result.answers?.find((a) => a.questionId === question._id);
                const isCorrect = answer?.isCorrect || false;

                return (
                  <Accordion
                    key={question._id}
                    expanded={expandedQuestion === question._id}
                    onChange={handleAccordionChange(question._id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                        <Chip
                          label={index + 1}
                          color={isCorrect ? 'success' : 'error'}
                          size="small"
                        />
                        <Typography sx={{ flexGrow: 1 }}>
                          {question.questionText.substring(0, 100)}
                          {question.questionText.length > 100 && '...'}
                        </Typography>
                        {isCorrect ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <QuestionCard
                        question={question}
                        questionNumber={index + 1}
                        userAnswer={answer?.userAnswer || ''}
                        correctAnswer={answer?.correctAnswer}
                        isCorrect={isCorrect}
                        showExplanation={true}
                        isReview={true}
                      />
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResultDetailPage;