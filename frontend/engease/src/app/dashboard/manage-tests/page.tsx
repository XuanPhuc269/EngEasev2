'use client';

import React, { useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import TestManagement from '@/components/dashboard/TestManagement';
import { useGetAllTestsQuery, useDeleteTestMutation, usePublishTestMutation, useUnpublishTestMutation } from '@/store/api/testApi';

const ManageTestsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: testsData, isLoading, error } = useGetAllTestsQuery({
    page,
    limit,
    isPublished: undefined, // Get all tests (published and unpublished)
  });

  const [deleteTest] = useDeleteTestMutation();
  const [publishTest] = usePublishTestMutation();
  const [unpublishTest] = useUnpublishTestMutation();

  const handleEdit = (testId: string) => {
    router.push(`/dashboard/edit-test/${testId}`);
  };

  const handleDelete = async (testId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài test này?')) {
      try {
        await deleteTest(testId).unwrap();
        // Success notification can be added here
      } catch (error) {
        console.error('Failed to delete test:', error);
        alert('Không thể xóa bài test. Vui lòng thử lại.');
      }
    }
  };

  const handleDuplicate = (testId: string) => {
    console.log('Duplicate test:', testId);
    // TODO: Implement duplicate functionality
  };

  const handleStatusChange = async (testId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await publishTest(testId).unwrap();
      } else {
        await unpublishTest(testId).unwrap();
      }
    } catch (error) {
      console.error('Failed to change status:', error);
      alert('Không thể thay đổi trạng thái. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">
          Không thể tải danh sách bài test. Vui lòng thử lại sau.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TestManagement
        tests={testsData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onStatusChange={handleStatusChange}
        loading={isLoading}
      />
    </Box>
  );
};

export default ManageTestsPage;