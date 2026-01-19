'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  School,
  Assessment,
  Person,
  Logout,
  Login,
  PersonAdd,
  Dashboard,
  Close,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/store/api/authApi';
import { UserRole } from '@/types';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by waiting for client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by showing consistent UI on SSR
  if (!mounted) {
    return (
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'background.paper',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                flexGrow: 0,
                mr: 4,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" fontWeight={700} color="white">
                  E
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                EngEase
              </Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logout());
      router.push('/');
    }
    handleMenuClose();
  };

  const navItems = [
    { label: 'Bài test', href: '/tests', icon: <School /> },
    { label: 'Tiến độ', href: '/progress', icon: <Assessment />, protected: true },
  ];

  const renderDesktopNav = () => (
    <>
      {/* Navigation Links */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {navItems.map((item) => {
          if (item.protected && !isAuthenticated) return null;
          return (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                px: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              startIcon={item.icon}
            >
              {item.label}
            </Button>
          );
        })}
        
        {isAuthenticated && (user?.role === UserRole.TEACHER || user?.role === UserRole.ADMIN) && (
          <Button
            component={Link}
            href="/dashboard"
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              px: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            startIcon={<Dashboard />}
          >
            Dashboard
          </Button>
        )}
      </Box>

      {/* Auth Section - Separate Box */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isAuthenticated ? (
          <>
            <IconButton 
              onClick={handleMenuOpen} 
              sx={{ 
                border: '2px solid',
                borderColor: 'divider',
              }}
            >
              <Avatar 
                src={user?.avatar} 
                alt={user?.name}
                sx={{ width: 34, height: 34 }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { router.push('/profile'); handleMenuClose(); }}>
                <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                Hồ sơ
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                Đăng xuất
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              component={Link}
              href="/login"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                px: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              startIcon={<Login />}
            >
              Đăng nhập
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e40af 0%, #6d28d9 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: 2,
                },
              }}
              startIcon={<PersonAdd />}
            >
              Đăng ký
            </Button>
          </>
        )}
      </Box>
    </>
  );

  const renderMobileNav = () => (
    <>
      <IconButton
        color="inherit"
        edge="start"
        onClick={() => setMobileMenuOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" fontWeight={700} color="white">
                  E
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                EngEase
              </Typography>
            </Box>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => {
              if (item.protected && !isAuthenticated) return null;
              return (
                <ListItem
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <List>
              {isAuthenticated ? (
                <>
                  <ListItem>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user?.avatar} alt={user?.name}>
                        {user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{user?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  <ListItem
                    component={Link}
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary="Hồ sơ" />
                  </ListItem>
                  <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
                    <ListItemIcon><Logout /></ListItemIcon>
                    <ListItemText primary="Đăng xuất" />
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem
                    component={Link}
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemIcon><Login /></ListItemIcon>
                    <ListItemText primary="Đăng nhập" />
                  </ListItem>
                  <ListItem
                    component={Link}
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemIcon><PersonAdd /></ListItemIcon>
                    <ListItemText primary="Đăng ký" />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'background.paper',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
          {isMobile && renderMobileNav()}
          
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              flexGrow: isMobile ? 1 : 0,
              justifyContent: isMobile ? 'center' : 'flex-start',
              mr: isMobile ? 0 : 4,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" fontWeight={700} color="white">
                E
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              EngEase
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
              {renderDesktopNav()}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;