'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ArrowBack,
} from '@mui/icons-material';
import { useGetTestByIdQuery } from '@/store/api/testApi';
import {
  useGetQuestionsByTestIdQuery,
  useDeleteQuestionMutation,
} from '@/store/api/questionApi';
import Link from 'next/link';

const ManageQuestionsPage = () => {
  const params = useParams();
  const router = useRouter();
  const testId = params?.id as string;

  const { data: testData, isLoading: testLoading } = useGetTestByIdQuery(testId);
  const { data: questionsData, isLoading: questionsLoading } = useGetQuestionsByTestIdQuery(testId);
  const [deleteQuestion] = useDeleteQuestionMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const handleDeleteClick = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedQuestionId) {
      try {
        await deleteQuestion(selectedQuestionId).unwrap();
        setDeleteDialogOpen(false);
        setSelectedQuestionId(null);
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
    }
  };

  if (testLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const test = testData?.data;
  const questions = questionsData?.data || [];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            href="/dashboard/manage-tests"
            startIcon={<ArrowBack />}
            variant="outlined"
          >
            Quay lại
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              Quản lý câu hỏi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {test?.title}
            </Typography>
          </Box>
          <Button
            component={Link}
            href={`/dashboard/manage-tests/${testId}/questions/create`}
            variant="contained"
            startIcon={<Add />}
          >
            Thêm câu hỏi
          </Button>
        </Box>

        {/* Test Info */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Loại bài test
              </Typography>
              <Chip label={test?.type} size="small" sx={{ mt: 0.5 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Độ khó
              </Typography>
              <Chip label={test?.difficulty} size="small" sx={{ mt: 0.5 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Tổng câu hỏi
              </Typography>
              <Typography variant="h6">{test?.totalQuestions}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Câu hỏi đã tạo
              </Typography>
              <Typography variant="h6" color={questions.length >= (test?.totalQuestions || 0) ? 'success.main' : 'warning.main'}>
                {questions.length}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Alert */}
        {questions.length < (test?.totalQuestions || 0) && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Bạn cần thêm {(test?.totalQuestions || 0) - questions.length} câu hỏi nữa để đủ số lượng câu hỏi cho bài test.
          </Alert>
        )}

        {/* Questions Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Câu hỏi</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Điểm</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">
                      Chưa có câu hỏi nào. Hãy thêm câu hỏi cho bài test.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow key={question._id}>
                    <TableCell>{question.questionNumber}</TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 400 }}>
                        {question.question}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={question.type} size="small" />
                    </TableCell>
                    <TableCell>{question.points}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        href={`/dashboard/manage-tests/${testId}/questions/${question._id}/edit`}
                        size="small"
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(question._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa câu hỏi</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageQuestionsPage;
