import { ThemeOptions } from '@mui/material/styles';

export const getThemeConfig = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#7C4DFF',
      light: '#B47CFF',
      dark: '#5635B2',
    },
    secondary: {
      main: '#00E5FF',
      light: '#6EFFFF',
      dark: '#00B2CC',
    },
    background: {
      default: mode === 'dark' ? '#0A0E1A' : '#F8FAFC',
      paper: mode === 'dark' ? '#111827' : '#FFFFFF',
    },
    success: {
      main: '#22C55E',
      light: '#4ADE80',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
    },
    text: {
      primary: mode === 'dark' ? '#F1F5F9' : '#0F172A',
      secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
    },
    divider: mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7C4DFF 0%, #536DFE 100%)',
          boxShadow: '0 4px 20px rgba(124, 77, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #651FFF 0%, #4052E0 100%)',
            boxShadow: '0 6px 30px rgba(124, 77, 255, 0.5)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.08)' : '1px solid rgba(15, 23, 42, 0.05)',
          borderRadius: 20,
          boxShadow: mode === 'dark' ? '0 4px 30px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(15, 23, 42, 0.03)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: mode === 'dark' ? '#111827' : '#FFFFFF',
          border: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: 20,
          boxShadow: mode === 'dark' ? '0 25px 50px rgba(0, 0, 0, 0.5)' : '0 25px 50px rgba(15, 23, 42, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: mode === 'dark' ? 'transparent' : 'rgba(15, 23, 42, 0.02)',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(124, 77, 255, 0.4)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark' ? 'rgba(10, 14, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: mode === 'dark' ? '0 1px 0 rgba(148, 163, 184, 0.08)' : '0 1px 0 rgba(15, 23, 42, 0.06)',
          color: mode === 'dark' ? '#F1F5F9' : '#0F172A',
        },
      },
    },
  },
});
