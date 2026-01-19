'use client';

import React, { useState, use } from 'react';
import { Box, Typography, Button, Alert, Snackbar, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CreateTestForm from '@/components/dashboard/CreateTestForm';
import { useGetTestByIdQuery, useUpdateTestMutation } from '@/store/api/testApi';
import { UpdateTestRequest } from '@/types';

interface EditTestPageProps {
  params: Promise<{ id: string }>;
}

const EditTestPage = ({ params }: EditTestPageProps) => {
  const { id } = use(params);
  const router = useRouter();
  const { data: testData, isLoading: loadingTest } = useGetTestByIdQuery(id);
  const [updateTest, { isLoading: updating }] = useUpdateTestMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const test = testData?.data;

  const handleSubmit = async (data: UpdateTestRequest) => {
    try {
      setError(null);
      await updateTest({ id, data }).unwrap();
      setSuccess(true);
      // Redirect back to manage tests after a short delay
      setTimeout(() => {
        router.push('/dashboard/manage-tests');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to update test:', err);
      setError(err.data?.message || 'Không thể cập nhật bài test. Vui lòng thử lại.');
    }
  };

  if (loadingTest) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!test) {
    return (
      <Box>
        <Alert severity="error">Không tìm thấy bài test.</Alert>
        <Button
          component={Link}
          href="/dashboard/manage-tests"
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component={Link}
          href="/dashboard/manage-tests"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Quay lại
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Chỉnh sửa bài test
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cập nhật thông tin bài test: {test.title}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <CreateTestForm 
        onSubmit={handleSubmit} 
        loading={updating}
        initialData={{
          title: test.title,
          description: test.description,
          type: test.type,
          difficulty: test.difficulty,
          duration: test.duration,
          totalQuestions: test.totalQuestions,
          passScore: test.passScore,
          tags: test.tags,
          audioUrl: test.audioUrl,
          readingPassage: test.readingPassage,
          writingPrompt: test.writingPrompt,
          speakingTopics: test.speakingTopics,
        }}
      />

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Cập nhật bài test thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditTestPage;
