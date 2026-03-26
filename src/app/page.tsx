'use client';

import { Box, Typography, Container, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, BarChart3, Bell, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    { icon: CheckCircle, title: 'Track Assignments', desc: 'Never miss a deadline again' },
    { icon: BarChart3, title: 'Visualize Workload', desc: 'See your week at a glance' },
    { icon: Bell, title: 'Stress Alerts', desc: 'Get warned when deadlines cluster' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,77,255,0.15) 0%, transparent 60%), #0A0E1A',
      }}
    >
      {/* Background orbs */}
      <Box
        sx={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,77,255,0.08) 0%, transparent 70%)',
          top: -150,
          right: -100,
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
          bottom: -100,
          left: -100,
          filter: 'blur(60px)',
        }}
      />

      <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} alignItems="center">
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(124,77,255,0.2) 0%, rgba(0,229,255,0.1) 100%)',
              border: '1px solid rgba(124,77,255,0.2)',
              mb: 2,
            }}
          >
            <GraduationCap size={40} color="#7C4DFF" />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #F1F5F9 0%, #7C4DFF 50%, #00E5FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.2rem', md: '3.5rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Study + Assignment
            <br />
            Tracker
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 500,
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.15rem' },
            }}
          >
            Your academic dashboard that prevents deadline stress.
            Track assignments, visualize workload, and stay ahead.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={20} />}
              onClick={() => router.push('/signup')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/login')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderColor: 'rgba(148,163,184,0.2)',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'rgba(124,77,255,0.05)',
                },
              }}
            >
              Sign In
            </Button>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ mt: 6 }}
          >
            {features.map((f, i) => (
              <Box
                key={i}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(17,24,39,0.5)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  backdropFilter: 'blur(10px)',
                  flex: 1,
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    border: '1px solid rgba(124,77,255,0.2)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <f.icon size={28} color="#7C4DFF" style={{ marginBottom: 8 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  {f.desc}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
