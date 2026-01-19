'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UpdateProfileRequest, User } from '@/types';

const profileSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc').min(2, 'Tên phải có ít nhất 2 ký tự'),
  targetScore: z.coerce.number().min(0, 'Điểm mục tiêu phải lớn hơn 0').max(9, 'Điểm IELTS tối đa là 9').optional().or(z.literal('')),
  currentLevel: z.string().optional(),
  avatar: z.string().url('URL avatar không hợp lệ').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: UpdateProfileRequest) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const levelOptions = [
  'Beginner (A1)',
  'Elementary (A2)',
  'Intermediate (B1)',
  'Upper Intermediate (B2)',
  'Advanced (C1)',
  'Proficient (C2)',
];

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  open,
  onClose,
  user,
  onSubmit,
  loading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      targetScore: user.targetScore || '',
      currentLevel: user.currentLevel || '',
      avatar: user.avatar || '',
    },
  });

  const handleFormSubmit = async (data: ProfileFormData) => {
    const updateData: UpdateProfileRequest = {
      name: data.name,
      ...(data.targetScore && { targetScore: Number(data.targetScore) }),
      ...(data.currentLevel && { currentLevel: data.currentLevel }),
      ...(data.avatar && { avatar: data.avatar }),
    };
    await onSubmit(updateData);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>Chỉnh sửa hồ sơ</Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Target Score */}
          <Controller
            name="targetScore"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Mục tiêu điểm IELTS"
                placeholder="Nhập điểm mục tiêu (0-9)"
                error={!!errors.targetScore}
                helperText={errors.targetScore?.message || 'Điểm IELTS bạn muốn đạt được'}
                disabled={loading}
                inputProps={{ min: 0, max: 9, step: 0.5 }}
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Current Level */}
          <Controller
            name="currentLevel"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Trình độ hiện tại"
                error={!!errors.currentLevel}
                helperText={errors.currentLevel?.message || 'Chọn trình độ tiếng Anh hiện tại của bạn'}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Không chọn</MenuItem>
                {levelOptions.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Avatar URL */}
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="URL Avatar"
                placeholder="https://example.com/avatar.jpg"
                error={!!errors.avatar}
                helperText={errors.avatar?.message || 'Nhập URL ảnh đại diện (không bắt buộc)'}
                disabled={loading}
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileForm;