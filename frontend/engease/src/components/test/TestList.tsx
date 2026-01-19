'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Pagination,
  Typography,
  Stack,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Link from 'next/link';
import TestCard from './TestCard';
import TestFilter, { TestFilterValues } from './TestFilter';
import { SearchBar } from '@/components/common';
import { Test } from '@/types';

interface TestListProps {
  tests: Test[];
  total: number;
  page: number;
  limit: number;
  loading?: boolean;
  error?: string | null;
  onPageChange: (page: number) => void;
  onFilterChange?: (filters: TestFilterValues) => void;
  onSearchChange?: (query: string) => void;
  onEdit?: (testId: string) => void;
  onDelete?: (testId: string) => void;
  showActions?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  showCreateButton?: boolean;
  emptyMessage?: string;
}

const TestList: React.FC<TestListProps> = ({
  tests,
  total,
  page,
  limit,
  loading = false,
  error = null,
  onPageChange,
  onFilterChange,
  onSearchChange,
  onEdit,
  onDelete,
  showActions = false,
  showFilters = true,
  showSearch = true,
  showCreateButton = false,
  emptyMessage = 'Không tìm thấy bài test nào',
}) => {
  const [filters, setFilters] = useState<TestFilterValues>({
    type: undefined,
    difficulty: undefined,
    isPublished: undefined,
  });

  const totalPages = Math.ceil(total / limit);

  const handleFilterChange = (newFilters: TestFilterValues) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Loading state
  if (loading) {
    return (
      <Box>
        {showFilters && (
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
          </Box>
        )}
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with Create Button */}
      {showCreateButton && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            component={Link}
            href="/dashboard/create-test"
            variant="contained"
            startIcon={<Add />}
          >
            Tạo bài test mới
          </Button>
        </Box>
      )}

      {/* Search */}
      {showSearch && onSearchChange && (
        <Box sx={{ mb: 3 }}>
          <SearchBar
            placeholder="Tìm kiếm bài test..."
            onSearch={onSearchChange}
          />
        </Box>
      )}

      {/* Filters */}
      {showFilters && onFilterChange && (
        <Box sx={{ mb: 3 }}>
          <TestFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            showPublishedFilter={showActions}
          />
        </Box>
      )}

      {/* Test Grid */}
      {tests.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {tests.map((test) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={test._id}>
                <TestCard
                  test={test}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showActions={showActions}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => onPageChange(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
              <Typography variant="body2" color="text.secondary">
                Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong tổng số {total} bài test
              </Typography>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default TestList;