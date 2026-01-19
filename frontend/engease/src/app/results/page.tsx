import React from 'react';
import { AuthGuard } from '@/components/guards';
import ResultsPage from '@/app/main/ResultsPage';

export default function ResultsRoute() {
  return (
    <AuthGuard>
      <ResultsPage />
    </AuthGuard>
  );
}
