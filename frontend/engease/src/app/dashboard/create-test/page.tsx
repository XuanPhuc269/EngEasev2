'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Alert, Snackbar } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CreateTestForm from '@/components/dashboard/CreateTestForm';
import { useCreateTestMutation } from '@/store/api/testApi';
import { CreateTestRequest } from '@/types';

const CreateTestPage = () => {
  const router = useRouter();
  const [createTest, { isLoading }] = useCreateTestMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: CreateTestRequest) => {
    try {
      setError(null);
      const result = await createTest(data).unwrap();
      setSuccess(true);
      // Redirect to questions management page
      setTimeout(() => {
        router.push(`/dashboard/manage-tests/${result.data._id}/questions`);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create test:', err);
      setError(err.data?.message || 'Không thể tạo bài test. Vui lòng thử lại.');
    }
  };

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
            Tạo bài test mới
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Điền thông tin để tạo bài test mới
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <CreateTestForm onSubmit={handleSubmit} loading={isLoading} />

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Tạo bài test thành công! Đang chuyển đến trang thêm câu hỏi...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTestPage;