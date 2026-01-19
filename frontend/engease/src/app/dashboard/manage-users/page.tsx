'use client';

import React, { useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import UserManagement from '@/components/dashboard/UserManagement';
import { User } from '@/types';
import { useGetAllUsersQuery } from '@/store/api/userApi';

const ManageUsersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: usersData, isLoading, error } = useGetAllUsersQuery({
    page,
    limit,
  });

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
    // TODO: Implement edit functionality - could open a dialog or navigate to edit page
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      console.log('Delete user:', userId);
      // TODO: Implement delete functionality with API
      alert('Chức năng xóa người dùng đang được phát triển.');
    }
  };

  const handleStatusChange = (userId: string, isActive: boolean) => {
    console.log('Change status:', userId, isActive);
    // TODO: Implement status change with API
    alert('Chức năng thay đổi trạng thái đang được phát triển.');
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
          Không thể tải danh sách người dùng. Vui lòng thử lại sau.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <UserManagement
        users={usersData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        loading={isLoading}
      />
    </Box>
  );
};

export default ManageUsersPage;