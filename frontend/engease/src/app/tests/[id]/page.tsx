'use client';

import { use } from 'react';
import TestDetailPage from '@/app/main/TestDetailPage';

export default function TestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TestDetailPage testId={id} />;
}
