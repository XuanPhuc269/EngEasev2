'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Block,
  CheckCircle,
  PersonAdd,
  Search,
} from '@mui/icons-material';
import { SearchBar, ConfirmDialog, Pagination } from '@/components/common';
import { User, UserRole } from '@/types';

interface UserManagementProps {
  users?: User[];
  loading?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onStatusChange?: (userId: string, isActive: boolean) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users = [],
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selectedUser) {
      setEditDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (selectedUser && onDelete) {
      onDelete(selectedUser._id);
    }
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleStatusToggle = () => {
    if (selectedUser && onStatusChange) {
      // Toggle active status - assuming there's an isActive field
      onStatusChange(selectedUser._id, !(selectedUser as any).isActive);
    }
    handleMenuClose();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'error';
      case UserRole.TEACHER:
        return 'warning';
      case UserRole.STUDENT:
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.TEACHER:
        return 'Giáo viên';
      case UserRole.STUDENT:
        return 'Học viên';
      default:
        return role;
    }
  };

  return (
    <Box>
      {/* Header & Filters */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Quản lý người dùng
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            sx={{ borderRadius: 2 }}
          >
            Thêm người dùng
          </Button>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm kiếm theo tên hoặc email..."
            />
          </Box>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={roleFilter}
              label="Vai trò"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
              <MenuItem value={UserRole.TEACHER}>Giáo viên</MenuItem>
              <MenuItem value={UserRole.STUDENT}>Học viên</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Điểm mục tiêu</TableCell>
                <TableCell>Trình độ</TableCell>
                <TableCell>Đăng nhập gần nhất</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.avatar} alt={user.name}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.targetScore ? `${user.targetScore}.0` : '-'}
                  </TableCell>
                  <TableCell>{user.currentLevel || '-'}</TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString('vi-VN')
                      : 'Chưa đăng nhập'}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong ${count}`
          }
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleStatusToggle}>
          {(selectedUser as any)?.isActive ? (
            <>
              <Block fontSize="small" sx={{ mr: 1 }} />
              Vô hiệu hóa
            </>
          ) : (
            <>
              <CheckCircle fontSize="small" sx={{ mr: 1 }} />
              Kích hoạt
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      {/* Edit Dialog - Basic implementation */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Tên"
              defaultValue={selectedUser?.name}
              fullWidth
            />
            <TextField
              label="Email"
              defaultValue={selectedUser?.email}
              fullWidth
              disabled
            />
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select defaultValue={selectedUser?.role} label="Vai trò">
                <MenuItem value={UserRole.STUDENT}>Học viên</MenuItem>
                <MenuItem value={UserRole.TEACHER}>Giáo viên</MenuItem>
                <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => setEditDialogOpen(false)}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
