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
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  ContentCopy,
  Add,
  PlayArrow,
  Pause,
  QuestionAnswer,
} from '@mui/icons-material';
import Link from 'next/link';
import { SearchBar, ConfirmDialog } from '@/components/common';
import { Test, TestType, TestDifficulty } from '@/types';

interface TestManagementProps {
  tests?: Test[];
  loading?: boolean;
  onEdit?: (testId: string) => void;
  onDelete?: (testId: string) => void;
  onDuplicate?: (testId: string) => void;
  onStatusChange?: (testId: string, isActive: boolean) => void;
}

const TestManagement: React.FC<TestManagementProps> = ({
  tests = [],
  loading,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, test: Test) => {
    setAnchorEl(event.currentTarget);
    setSelectedTest(test);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selectedTest && onEdit) {
      onEdit(selectedTest._id);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (selectedTest && onDelete) {
      onDelete(selectedTest._id);
    }
    setDeleteDialogOpen(false);
    setSelectedTest(null);
  };

  const handleDuplicate = () => {
    if (selectedTest && onDuplicate) {
      onDuplicate(selectedTest._id);
    }
    handleMenuClose();
  };

  const handleStatusToggle = () => {
    if (selectedTest && onStatusChange) {
      onStatusChange(selectedTest._id, !selectedTest.isPublished);
    }
    handleMenuClose();
  };

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || test.type === typeFilter;
    const matchesDifficulty =
      difficultyFilter === 'all' || test.difficulty === difficultyFilter;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const paginatedTests = filteredTests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getTypeColor = (type: TestType) => {
    switch (type) {
      case 'listening':
        return 'info';
      case 'reading':
        return 'success';
      case 'writing':
        return 'warning';
      case 'speaking':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: TestType) => {
    switch (type) {
      case 'listening':
        return 'Listening';
      case 'reading':
        return 'Reading';
      case 'writing':
        return 'Writing';
      case 'speaking':
        return 'Speaking';
      default:
        return type;
    }
  };

  const getDifficultyLabel = (difficulty: TestDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return difficulty;
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
            Quản lý bài test
          </Typography>
          <Button
            component={Link}
            href="/dashboard/create-test"
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
          >
            Tạo bài test mới
          </Button>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm kiếm bài test..."
            />
          </Box>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Loại</InputLabel>
            <Select
              value={typeFilter}
              label="Loại"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="listening">Listening</MenuItem>
              <MenuItem value="reading">Reading</MenuItem>
              <MenuItem value="writing">Writing</MenuItem>
              <MenuItem value="speaking">Speaking</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Độ khó</InputLabel>
            <Select
              value={difficultyFilter}
              label="Độ khó"
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="easy">Dễ</MenuItem>
              <MenuItem value="medium">Trung bình</MenuItem>
              <MenuItem value="hard">Khó</MenuItem>
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
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Độ khó</TableCell>
                <TableCell>Số câu hỏi</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTests.map((test) => (
                <TableRow key={test._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {test.title}
                    </Typography>
                    {test.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {test.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTypeLabel(test.type)}
                      color={getTypeColor(test.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{getDifficultyLabel(test.difficulty)}</TableCell>
                  <TableCell>{test.questionCount || 0}</TableCell>
                  <TableCell>{test.duration} phút</TableCell>
                  <TableCell>
                    <Chip
                      label={test.isPublished ? 'Đã xuất bản' : 'Nháp'}
                      color={test.isPublished ? 'success' : 'default'}
                      size="small"
                      icon={test.isPublished ? <PlayArrow /> : <Pause />}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(test.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, test)}
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
          count={filteredTests.length}
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
        <MenuItem
          component={Link}
          href={`/test/${selectedTest?._id}`}
          onClick={handleMenuClose}
        >
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/dashboard/manage-tests/${selectedTest?._id}/questions`}
          onClick={handleMenuClose}
        >
          <QuestionAnswer fontSize="small" sx={{ mr: 1 }} />
          Quản lý câu hỏi
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ContentCopy fontSize="small" sx={{ mr: 1 }} />
          Nhân bản
        </MenuItem>
        <MenuItem onClick={handleStatusToggle}>
          {selectedTest?.isPublished ? (
            <>
              <Pause fontSize="small" sx={{ mr: 1 }} />
              Gỡ xuất bản
            </>
          ) : (
            <>
              <PlayArrow fontSize="small" sx={{ mr: 1 }} />
              Xuất bản
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
        title="Xác nhận xóa bài test"
        message={`Bạn có chắc chắn muốn xóa bài test "${selectedTest?.title}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </Box>
  );
};

export default TestManagement;
