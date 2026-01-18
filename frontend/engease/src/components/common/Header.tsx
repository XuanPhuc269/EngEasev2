'use client';

import React, { useState } from 'react';
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
    { label: 'Trang chủ', href: '/', icon: <Home /> },
    { label: 'Bài test', href: '/tests', icon: <School /> },
    { label: 'Tiến độ', href: '/progress', icon: <Assessment />, protected: true },
  ];

  const renderDesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {navItems.map((item) => {
        if (item.protected && !isAuthenticated) return null;
        return (
          <Button
            key={item.href}
            component={Link}
            href={item.href}
            color="inherit"
            startIcon={item.icon}
          >
            {item.label}
          </Button>
        );
      })}
      
      {isAuthenticated ? (
        <>
          {(user?.role === UserRole.TEACHER || user?.role === UserRole.ADMIN) && (
            <Button
              component={Link}
              href="/dashboard"
              color="inherit"
              startIcon={<Dashboard />}
            >
              Dashboard
            </Button>
          )}
          <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
            <Avatar 
              src={user?.avatar} 
              alt={user?.name}
              sx={{ width: 36, height: 36 }}
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            href="/login"
            color="inherit"
            startIcon={<Login />}
          >
            Đăng nhập
          </Button>
          <Button
            component={Link}
            href="/register"
            variant="contained"
            color="secondary"
            startIcon={<PersonAdd />}
          >
            Đăng ký
          </Button>
        </Box>
      )}
    </Box>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 2 }}>
            <Typography variant="h6" color="primary">
              EngEase
            </Typography>
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
      </Drawer>
    </>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && renderMobileNav()}
          
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: isMobile ? 1 : 0,
              textAlign: isMobile ? 'center' : 'left',
              mr: isMobile ? 0 : 4,
            }}
          >
            EngEase
          </Typography>

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