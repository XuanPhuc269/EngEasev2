import React from 'react';
import { AuthGuard } from '@/components/guards';
import ResultDetailPage from '@/app/main/ResultDetailPage';

interface ResultDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResultDetailRoute({ params }: ResultDetailRouteProps) {
  const { id } = await params;
  
  return (
    <AuthGuard>
      <ResultDetailPage resultId={id} />
    </AuthGuard>
  );
}
