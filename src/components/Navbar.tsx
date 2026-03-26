'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useThemeContext } from '@/theme/ThemeProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Menu,
  GraduationCap,
  X,
  Moon,
  Sun,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Assignments', href: '/assignments', icon: ClipboardList },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleTheme } = useThemeContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const userEmail = user?.email || '';
  const userName = userEmail.split('@')[0];
  const userInitial = userName.charAt(0).toUpperCase();

  if (!user) return null;

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 1, color: 'text.primary' }}
              >
                <Menu size={22} />
              </IconButton>
            )}

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push('/dashboard')}
            >
              <GraduationCap size={28} color="#7C4DFF" />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #7C4DFF, #00E5FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                }}
              >
                StudyTracker
              </Typography>
            </Stack>

            <Box sx={{ flex: 1 }} />

            {!isMobile && (
              <Stack direction="row" spacing={1} sx={{ mr: 3 }}>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      startIcon={<item.icon size={18} />}
                      sx={{
                        color: isActive ? 'primary.light' : 'text.secondary',
                        fontWeight: isActive ? 700 : 500,
                        background: isActive ? 'rgba(124,77,255,0.1)' : 'transparent',
                        borderRadius: 3,
                        px: 2,
                        '&:hover': {
                          background: isActive
                            ? 'rgba(124,77,255,0.15)'
                            : 'rgba(148,163,184,0.08)',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            )}

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                  <IconButton
                    onClick={toggleTheme}
                    size="small"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  </IconButton>
                </Tooltip>
              </Stack>

              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: 'primary.main',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {userInitial}
              </Avatar>
              {!isMobile && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {userName}
                </Typography>
              )}
              <IconButton
                onClick={handleSignOut}
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
              >
                <LogOut size={18} />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: mode === 'dark' ? '#111827' : '#FFFFFF',
            borderRight: mode === 'dark' ? '1px solid rgba(148,163,184,0.08)' : '1px solid rgba(15, 23, 42, 0.06)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <GraduationCap size={24} color="#7C4DFF" />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #7C4DFF, #00E5FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                StudyTracker
              </Typography>
            </Stack>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <X size={20} />
            </IconButton>
          </Stack>

          <List>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      router.push(item.href);
                      setDrawerOpen(false);
                    }}
                    sx={{
                      borderRadius: 3,
                      bgcolor: isActive ? 'rgba(124,77,255,0.1)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(124,77,255,0.08)' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.light' : 'text.secondary' }}>
                      <item.icon size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'primary.light' : 'text.primary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
