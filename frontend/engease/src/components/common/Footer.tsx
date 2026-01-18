'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Listening', href: '/tests?type=listening' },
      { label: 'Reading', href: '/tests?type=reading' },
      { label: 'Writing', href: '/tests?type=writing' },
      { label: 'Speaking', href: '/tests?type=speaking' },
    ],
    company: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Liên hệ', href: '/contact' },
      { label: 'Tuyển dụng', href: '/careers' },
    ],
    support: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Hướng dẫn sử dụng', href: '/guide' },
      { label: 'Điều khoản dịch vụ', href: '/terms' },
      { label: 'Chính sách bảo mật', href: '/privacy' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" color="white" gutterBottom fontWeight={700}>
              EngEase
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, maxWidth: 300 }}>
              Nền tảng học IELTS trực tuyến hàng đầu Việt Nam. Chinh phục band điểm
              mơ ước cùng đội ngũ giáo viên chuyên nghiệp.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Kỹ năng
            </Typography>
            {footerLinks.product.map((link) => (
              <MuiLink
                key={link.href}
                component={Link}
                href={link.href}
                color="inherit"
                display="block"
                sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}
                underline="none"
              >
                {link.label}
              </MuiLink>
            ))}
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Công ty
            </Typography>
            {footerLinks.company.map((link) => (
              <MuiLink
                key={link.href}
                component={Link}
                href={link.href}
                color="inherit"
                display="block"
                sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}
                underline="none"
              >
                {link.label}
              </MuiLink>
            ))}
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Hỗ trợ
            </Typography>
            {footerLinks.support.map((link) => (
              <MuiLink
                key={link.href}
                component={Link}
                href={link.href}
                color="inherit"
                display="block"
                sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}
                underline="none"
              >
                {link.label}
              </MuiLink>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 8, md: 2 }}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Liên hệ
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">support@engease.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">1900 xxxx xx</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LocationOn fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="body2">
                123 Nguyễn Huệ, Q.1, TP.HCM
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'grey.800' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.500">
            © {currentYear} EngEase. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink
              component={Link}
              href="/terms"
              color="grey.500"
              underline="hover"
              variant="body2"
            >
              Điều khoản
            </MuiLink>
            <MuiLink
              component={Link}
              href="/privacy"
              color="grey.500"
              underline="hover"
              variant="body2"
            >
              Bảo mật
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;