'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/types/auth.types';

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * Get default redirect path based on user role
 */
const getDefaultRedirectPath = (role?: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return '/dashboard';
    case UserRole.TEACHER:
      return '/dashboard';
    case UserRole.STUDENT:
    default:
      return '/tests';
  }
};

/**
 * Guard component that protects routes for guests only (login, register, etc)
 * Redirects authenticated users to appropriate dashboard based on their role
 */
const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const redirectPath = getDefaultRedirectPath(user.role);
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Don't render children if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default GuestGuard;
export { getDefaultRedirectPath };