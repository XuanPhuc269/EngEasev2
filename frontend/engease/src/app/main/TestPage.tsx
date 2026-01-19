'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import TestList from '@/components/test/TestList';
import { TestFilterValues } from '@/components/test/TestFilter';
import { useGetAllTestsQuery } from '@/store/api/testApi';
import { TestType } from '@/types';

const TestPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [filters, setFilters] = useState<TestFilterValues>({
    type: undefined,
    difficulty: undefined,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const limit = 12;

  // Get current filter type based on tab
  const currentType = selectedTab === 'all' ? undefined : (selectedTab as TestType);

  const { data, isLoading, error } = useGetAllTestsQuery({
    page,
    limit,
    type: currentType || filters.type,
    difficulty: filters.difficulty,
    isPublished: true, // Only show published tests to students
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    setPage(1);
  };

  const handleFilterChange = (newFilters: TestFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter tests by search query
  const filteredTests = data?.data.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Quay về trang chủ
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Kho bài thi IELTS
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Khám phá và luyện tập với hơn 500+ bài thi IELTS chất lượng
        </Typography>
      </Box>

      {/* Tabs for Test Types */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tất cả" value="all" />
          <Tab label="Listening" value={TestType.LISTENING} />
          <Tab label="Reading" value={TestType.READING} />
          <Tab label="Writing" value={TestType.WRITING} />
          <Tab label="Speaking" value={TestType.SPEAKING} />
          <Tab label="Full Test" value={TestType.FULL_TEST} />
        </Tabs>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Không thể tải danh sách bài thi. Vui lòng thử lại sau.
        </Alert>
      )}

      {/* Test List */}
      <TestList
        tests={filteredTests}
        total={data?.pagination.total || 0}
        page={page}
        limit={limit}
        loading={isLoading}
        error={error ? 'Lỗi tải dữ liệu' : null}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        showFilters={true}
        showSearch={true}
        showActions={false}
        emptyMessage="Không tìm thấy bài test nào phù hợp"
      />
    </Container>
  );
};

export default TestPage;