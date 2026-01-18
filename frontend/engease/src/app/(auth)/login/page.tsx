'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* Logo */}
      <Link href="/" passHref>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 4,
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" fontWeight={700} color="white">
              E
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            EngEase
          </Typography>
        </Box>
      </Link>

      {/* Login Form */}
      <LoginForm />
    </Box>
  );
}
