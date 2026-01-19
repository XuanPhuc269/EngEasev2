'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  School,
  TrendingUp,
  EmojiEvents,
  Assessment,
  Speed,
  PersonAdd,
  Login,
  Dashboard,
  MenuBook,
  Create,
  ArrowForward,
  CheckCircle,
  Star,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/common';
import { useAppSelector } from '@/store/hooks';

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const features = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Luyện tập 4 kỹ năng',
      description: 'Listening, Reading, Writing, Speaking với bài tập đa dạng',
      color: '#2563eb',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Theo dõi tiến độ',
      description: 'Thống kê chi tiết kết quả học tập và cải thiện',
      color: '#16a34a',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Đề thi thực tế',
      description: 'Mô phỏng bài thi IELTS chính xác theo chuẩn quốc tế',
      color: '#f59e0b',
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: 'Đánh giá chi tiết',
      description: 'Phân tích điểm mạnh, điểm yếu và gợi ý cải thiện',
      color: '#8b5cf6',
    },
  ];

  const testTypes = [
    {
      title: 'Listening',
      description: 'Luyện nghe với các bài thi thực tế',
      icon: <MenuBook />,
      href: '/tests?type=listening',
      color: '#3b82f6',
      tests: '50+ bài thi',
    },
    {
      title: 'Reading',
      description: 'Nâng cao kỹ năng đọc hiểu',
      icon: <MenuBook />,
      href: '/tests?type=reading',
      color: '#10b981',
      tests: '60+ bài thi',
    },
    {
      title: 'Writing',
      description: 'Luyện viết Task 1 và Task 2',
      icon: <Create />,
      href: '/tests?type=writing',
      color: '#f59e0b',
      tests: '40+ đề bài',
    },
    {
      title: 'Speaking',
      description: 'Thực hành giao tiếp tiếng Anh',
      icon: <MenuBook />,
      href: '/tests?type=speaking',
      color: '#ef4444',
      tests: '30+ chủ đề',
    },
  ];

  const stats = [
    { label: 'Học viên', value: '10,000+', icon: <School /> },
    { label: 'Bài thi', value: '500+', icon: <Assessment /> },
    { label: 'Tỷ lệ đạt mục tiêu', value: '95%', icon: <EmojiEvents /> },
    { label: 'Đánh giá 5 sao', value: '4.9/5', icon: <Star /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
          py: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            opacity: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h2"
                fontWeight={800}
                gutterBottom
                sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
              >
                Chinh phục IELTS cùng EngEase
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}
              >
                Nền tảng luyện thi IELTS trực tuyến toàn diện với hơn 500+ bài thi
                thực tế và hệ thống đánh giá thông minh
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {isAuthenticated ? (
                  <>
                    <Button
                      component={Link}
                      href="/tests"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.9),
                          transform: 'translateY(-2px)',
                        },
                        py: 1.5,
                        px: 4,
                      }}
                    >
                      Bắt đầu luyện tập
                    </Button>
                    <Button
                      component={Link}
                      href={user?.role === 'admin' || user?.role === 'teacher' ? '/dashboard' : '/profile'}
                      variant="outlined"
                      size="large"
                      endIcon={<Dashboard />}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: alpha('#fff', 0.1),
                        },
                        py: 1.5,
                        px: 4,
                      }}
                    >
                      {user?.role === 'admin' || user?.role === 'teacher' ? 'Dashboard' : 'Hồ sơ'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      href="/register"
                      variant="contained"
                      size="large"
                      endIcon={<PersonAdd />}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.9),
                          transform: 'translateY(-2px)',
                        },
                        py: 1.5,
                        px: 4,
                      }}
                    >
                      Đăng ký miễn phí
                    </Button>
                    <Button
                      component={Link}
                      href="/login"
                      variant="outlined"
                      size="large"
                      endIcon={<Login />}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: alpha('#fff', 0.1),
                        },
                        py: 1.5,
                        px: 4,
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '120%',
                    height: '120%',
                    background: alpha('#fff', 0.1),
                    borderRadius: '50%',
                    animation: 'pulse 3s ease-in-out infinite',
                  },
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
                    '50%': { transform: 'translate(-50%, -50%) scale(1.1)' },
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center',
                    p: 4,
                  }}
                >
                  <Assessment sx={{ fontSize: 200, opacity: 0.9 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      color: 'primary.main',
                      mb: 1,
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
                  </Box>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Tại sao chọn EngEase?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Nền tảng học IELTS hiện đại với công nghệ AI và phương pháp giảng dạy tiên tiến
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(feature.color, 0.1),
                      color: feature.color,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Test Types Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Luyện tập 4 kỹ năng
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Chọn kỹ năng bạn muốn luyện tập ngay hôm nay
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {testTypes.map((type, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  component={Link}
                  href={type.href}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      background: `linear-gradient(135deg, ${type.color} 0%, ${alpha(type.color, 0.7)} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {React.cloneElement(type.icon, { sx: { fontSize: 60 } })}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {type.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {type.description}
                    </Typography>
                    <Chip
                      label={type.tests}
                      size="small"
                      sx={{
                        bgcolor: alpha(type.color, 0.1),
                        color: type.color,
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      endIcon={<ArrowForward />}
                      sx={{ color: type.color }}
                    >
                      Bắt đầu
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Sẵn sàng chinh phục IELTS?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Tham gia cùng hàng ngàn học viên đã đạt được mục tiêu của họ
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              {isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    href="/tests"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Xem tất cả bài thi
                  </Button>
                  <Button
                    component={Link}
                    href="/progress"
                    variant="outlined"
                    size="large"
                    endIcon={<TrendingUp />}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Xem tiến độ
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    size="large"
                    endIcon={<PersonAdd />}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Đăng ký ngay
                  </Button>
                  <Button
                    component={Link}
                    href="/tests"
                    variant="outlined"
                    size="large"
                    endIcon={<Speed />}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Dùng thử miễn phí
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
