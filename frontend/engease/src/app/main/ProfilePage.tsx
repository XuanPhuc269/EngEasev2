'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Snackbar,
  Button,
  Stack,
  Skeleton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ProfileInfo from '@/components/profile/ProfileInfo';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import DeleteAccountDialog from '@/components/profile/DeleteAccountDialog';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from '@/store/api/userApi';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { UpdateProfileRequest, ChangePasswordRequest, DeleteAccountRequest } from '@/types';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Dialogs state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  // API hooks
  const { data: profileData, isLoading: profileLoading, error: profileError } = useGetProfileQuery();
  const [updateProfile, { isLoading: updateLoading, error: updateError }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: passwordLoading, error: passwordError }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: deleteLoading, error: deleteError }] = useDeleteAccountMutation();

  const user = profileData?.data;

  // Handlers
  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data).unwrap();
      setToast({
        open: true,
        message: 'Cập nhật hồ sơ thành công!',
        severity: 'success',
      });
      setEditDialogOpen(false);
    } catch (err: any) {
      console.error('Update profile error:', err);
      setToast({
        open: true,
        message: err?.data?.message || 'Cập nhật hồ sơ thất bại',
        severity: 'error',
      });
    }
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    try {
      await changePassword(data).unwrap();
      setToast({
        open: true,
        message: 'Đổi mật khẩu thành công!',
        severity: 'success',
      });
      setPasswordDialogOpen(false);
    } catch (err: any) {
      console.error('Change password error:', err);
      setToast({
        open: true,
        message: err?.data?.message || 'Đổi mật khẩu thất bại',
        severity: 'error',
      });
    }
  };

  const handleDeleteAccount = async (data: DeleteAccountRequest) => {
    try {
      await deleteAccount(data).unwrap();
      setToast({
        open: true,
        message: 'Tài khoản đã được xóa',
        severity: 'info',
      });
      setDeleteDialogOpen(false);
      
      // Logout and redirect
      setTimeout(() => {
        dispatch(logout());
        router.push('/');
      }, 1500);
    } catch (err: any) {
      console.error('Delete account error:', err);
      setToast({
        open: true,
        message: err?.data?.message || 'Xóa tài khoản thất bại',
        severity: 'error',
      });
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // Loading state
  if (profileLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  // Error state
  if (profileError || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Quay về trang chủ
        </Button>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Hồ sơ cá nhân
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
        </Typography>
      </Box>

      {/* Profile Info Card */}
      <ProfileInfo
        user={user}
        onEditClick={() => setEditDialogOpen(true)}
        onChangePasswordClick={() => setPasswordDialogOpen(true)}
        loading={updateLoading}
      />

      {/* Danger Zone */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          border: '1px solid',
          borderColor: 'error.main',
          borderRadius: 2,
          bgcolor: 'error.lighter',
        }}
      >
        <Typography variant="h6" fontWeight={700} color="error.main" gutterBottom>
          Vùng nguy hiểm
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn. Hành động này không thể hoàn tác.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ minWidth: 160 }}
          >
            Xóa tài khoản
          </Button>
        </Stack>
      </Box>

      {/* Edit Profile Dialog */}
      {user && (
        <EditProfileForm
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          user={user}
          onSubmit={handleUpdateProfile}
          loading={updateLoading}
          error={updateError ? 'Cập nhật thất bại' : null}
        />
      )}

      {/* Change Password Dialog */}
      <ChangePasswordForm
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        onSubmit={handleChangePassword}
        loading={passwordLoading}
        error={passwordError ? 'Đổi mật khẩu thất bại' : null}
      />

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
        error={deleteError ? 'Xóa tài khoản thất bại' : null}
      />

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;