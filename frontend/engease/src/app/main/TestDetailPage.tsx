'use client';

import React from 'react';
import {
  Container,
  Box,
  Button,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { ArrowBack, Home, School } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TestDetail from '@/components/test/TestDetail';
import { useGetTestByIdQuery } from '@/store/api/testApi';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types';

interface TestDetailPageProps {
  testId: string;
}

const TestDetailPage: React.FC<TestDetailPageProps> = ({ testId }) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useGetTestByIdQuery(testId);

  const canEdit = user && (user.role === UserRole.ADMIN || user.role === UserRole.TEACHER);

  const handleEdit = () => {
    router.push(`/dashboard/edit-test/${testId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  // Error state
  if (error || !data?.data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Không tìm thấy bài test. Bài test không tồn tại hoặc đã bị xóa.
        </Alert>
        <Button
          component={Link}
          href="/tests"
          variant="contained"
          startIcon={<ArrowBack />}
        >
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  const test = data.data;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink
          component={Link}
          href="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Home fontSize="small" />
          Trang chủ
        </MuiLink>
        <MuiLink
          component={Link}
          href="/tests"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <School fontSize="small" />
          Bài thi
        </MuiLink>
        <Box sx={{ color: 'text.primary' }}>{test.title}</Box>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        component={Link}
        href="/tests"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Quay lại danh sách
      </Button>

      {/* Test Detail */}
      <TestDetail test={test} onEdit={handleEdit} canEdit={canEdit} />
    </Container>
  );
};

export default TestDetailPage;