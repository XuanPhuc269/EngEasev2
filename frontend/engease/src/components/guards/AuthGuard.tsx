'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector } from '@/store/hooks';

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Guard component that protects routes requiring authentication
 * Redirects unauthenticated users to login page
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallbackUrl = '/login' 
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  // Track when component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not authenticated (only on client)
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push(fallbackUrl);
    }
  }, [isAuthenticated, isLoading, router, fallbackUrl, isMounted]);

  // Don't render anything on server to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render children until authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;