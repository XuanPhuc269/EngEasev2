'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { useGetUserTestResultsQuery } from '@/store/api/resultApi';
import { ResultList, ResultStats } from '@/components/result';

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: resultsData, isLoading, error } = useGetUserTestResultsQuery({ page, limit });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Không thể tải kết quả. Vui lòng thử lại sau.
        </Alert>
      </Container>
    );
  }

  const results = resultsData?.results || [];
  const totalPages = Math.ceil((resultsData?.total || 0) / limit);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Kết quả của tôi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xem lại các bài thi đã hoàn thành
        </Typography>
      </Box>

      {/* Summary Stats */}
      {resultsData && results.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <ResultStats results={results} />
        </Box>
      )}

      {/* Results List */}
      {results.length === 0 ? (
        <Alert severity="info">
          Bạn chưa hoàn thành bài thi nào. Hãy bắt đầu làm bài thi đầu tiên!
        </Alert>
      ) : (
        <ResultList results={results} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ResultsPage;