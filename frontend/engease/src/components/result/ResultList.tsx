'use client';

import React from 'react';
import { Stack } from '@mui/material';
import ResultCard from './ResultCard';
import { TestResult } from '@/types';

interface ResultListProps {
  results: TestResult[];
}

const ResultList: React.FC<ResultListProps> = ({ results }) => {
  return (
    <Stack spacing={2}>
      {results.map((result) => (
        <ResultCard key={result._id} result={result} />
      ))}
    </Stack>
  );
};

export default ResultList;
