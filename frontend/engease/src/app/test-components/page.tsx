'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import {
  LoadingSpinner,
  ErrorBoundary,
  ConfirmDialog,
  NotificationSnackbar,
  useNotification,
  Pagination,
  SearchBar,
  EmptyState,
} from '@/components/common';
import type { SearchFilter } from '@/components/common';

// Component that throws error for testing ErrorBoundary
const BuggyComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error from BuggyComponent!');
  }
  return <Typography>Component hoạt động bình thường</Typography>;
};

const ComponentTestPage: React.FC = () => {
  // States for testing
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogType, setConfirmDialogType] = useState<
    'warning' | 'error' | 'info' | 'success' | 'confirm'
  >('confirm');
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search state
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Error boundary state
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // Notification hook
  const {
    notification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useNotification();

  // Search filters
  const searchFilters: SearchFilter[] = [
    {
      key: 'type',
      label: 'Loại bài test',
      value: '',
      options: [
        { label: 'Listening', value: 'listening' },
        { label: 'Reading', value: 'reading' },
        { label: 'Writing', value: 'writing' },
        { label: 'Speaking', value: 'speaking' },
      ],
    },
    {
      key: 'difficulty',
      label: 'Độ khó',
      value: '',
      options: [
        { label: 'Dễ', value: 'easy' },
        { label: 'Trung bình', value: 'medium' },
        { label: 'Khó', value: 'hard' },
      ],
    },
  ];

  // Handlers
  const handleConfirm = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setConfirmDialogOpen(false);
      showSuccess('Hành động đã được xác nhận!');
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight={700}>
        🧪 Component Test Page
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Trang này dùng để test các common components
      </Typography>

      <Grid container spacing={4}>
        {/* Loading Spinner Section */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              1. Loading Spinner
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Circular (Default)
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                  <LoadingSpinner message="Đang tải dữ liệu..." />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Linear
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                  <LoadingSpinner variant="linear" message="Đang xử lý..." />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Dots Animation
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                  <LoadingSpinner variant="dots" message="Vui lòng chờ..." />
                </Box>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" sx={{ mt: 3 }} gutterBottom>
              Sizes
            </Typography>
            <Stack direction="row" spacing={4} alignItems="center">
              <LoadingSpinner size="small" />
              <LoadingSpinner size="medium" />
              <LoadingSpinner size="large" />
            </Stack>
          </Paper>
        </Grid>

        {/* Confirm Dialog Section */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              2. Confirm Dialog
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {(['confirm', 'warning', 'error', 'info', 'success'] as const).map(
                (type) => (
                  <Button
                    key={type}
                    variant="outlined"
                    onClick={() => {
                      setConfirmDialogType(type);
                      setConfirmDialogOpen(true);
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)} Dialog
                  </Button>
                )
              )}
            </Stack>

            <ConfirmDialog
              open={confirmDialogOpen}
              onClose={() => setConfirmDialogOpen(false)}
              onConfirm={handleConfirm}
              title={`${confirmDialogType.charAt(0).toUpperCase() + confirmDialogType.slice(1)} Dialog`}
              message="Đây là nội dung của dialog. Bạn có chắc chắn muốn thực hiện hành động này không?"
              type={confirmDialogType}
              loading={confirmLoading}
              confirmText="Xác nhận"
              cancelText="Hủy bỏ"
            />
          </Paper>
        </Grid>

        {/* Notification Snackbar Section */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              3. Notification Snackbar
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button
                variant="contained"
                color="success"
                onClick={() => showSuccess('Thành công!', 'Success')}
              >
                Show Success
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => showError('Đã xảy ra lỗi!', 'Error')}
              >
                Show Error
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => showWarning('Cảnh báo quan trọng!', 'Warning')}
              >
                Show Warning
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => showInfo('Thông tin mới!', 'Info')}
              >
                Show Info
              </Button>
            </Stack>

            <NotificationSnackbar
              open={notification.open}
              onClose={hideNotification}
              message={notification.message}
              type={notification.type}
              title={notification.title}
            />
          </Paper>
        </Grid>

        {/* Pagination Section */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              4. Pagination
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Pagination
              page={currentPage}
              totalPages={10}
              totalItems={95}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>
              Current Page: <strong>{currentPage}</strong> | Page Size:{' '}
              <strong>{pageSize}</strong>
            </Typography>
          </Paper>
        </Grid>

        {/* Search Bar Section */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              5. Search Bar
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <SearchBar
              placeholder="Tìm kiếm bài test..."
              onSearch={setSearchValue}
              filters={searchFilters}
              onFilterChange={setFilterValues}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Search Value: <strong>{searchValue || '(empty)'}</strong>
              </Typography>
              <Typography variant="body2">
                Filters: <strong>{JSON.stringify(filterValues)}</strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Empty State Section */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              6. Empty State
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <EmptyState
                  type="no-data"
                  size="small"
                  paper
                  actionText="Thêm mới"
                  onAction={() => showInfo('Thêm mới clicked!')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <EmptyState
                  type="no-results"
                  size="small"
                  paper
                  actionText="Xóa bộ lọc"
                  onAction={() => showInfo('Xóa bộ lọc clicked!')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <EmptyState
                  type="error"
                  size="small"
                  paper
                  actionText="Thử lại"
                  onAction={() => showInfo('Thử lại clicked!')}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Error Boundary Section */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              7. Error Boundary
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Nhấn nút bên dưới để trigger error và xem Error Boundary hoạt động
            </Typography>

            <Button
              variant="contained"
              color="error"
              onClick={() => setShouldThrowError(true)}
              sx={{ mb: 2 }}
            >
              Trigger Error
            </Button>

            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
              <ErrorBoundary
                onError={(error) => console.log('Error caught:', error)}
              >
                <BuggyComponent shouldThrow={shouldThrowError} />
              </ErrorBoundary>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ComponentTestPage;
