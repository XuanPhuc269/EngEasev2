import React from 'react';
import { AuthGuard } from '@/components/guards';
import TakeTestPage from '@/app/main/TakeTestPage';

interface TakeTestRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TakeTestRoute({ params }: TakeTestRouteProps) {
  const { id } = await params;
  
  return (
    <AuthGuard>
      <TakeTestPage testId={id} />
    </AuthGuard>
  );
}
