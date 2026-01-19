'use client';

import { AuthGuard } from '@/components/guards';
import ProfilePage from '../main/ProfilePage';

export default function Profile() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
