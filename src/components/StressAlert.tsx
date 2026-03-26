'use client';

import { Alert, AlertTitle, Collapse, Box } from '@mui/material';
import { Assignment } from '@/types/assignment';
import { getStressAlert } from '@/lib/utils';
import { AlertTriangle, Flame } from 'lucide-react';

interface StressAlertProps {
  assignments: Assignment[];
}

export default function StressAlert({ assignments }: StressAlertProps) {
  const { isStressed, message, severity } = getStressAlert(assignments);

  return (
    <Collapse in={isStressed}>
      <Alert
        severity={severity}
        variant="filled"
        icon={
          severity === 'error' ? (
            <Flame size={24} />
          ) : (
            <AlertTriangle size={24} />
          )
        }
        sx={{
          mb: 3,
          borderRadius: 3,
          background:
            severity === 'error'
              ? 'linear-gradient(135deg, rgba(239,68,68,0.9) 0%, rgba(185,28,28,0.9) 100%)'
              : 'linear-gradient(135deg, rgba(245,158,11,0.9) 0%, rgba(217,119,6,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow:
            severity === 'error'
              ? '0 4px 30px rgba(239,68,68,0.3)'
              : '0 4px 30px rgba(245,158,11,0.3)',
          animation: isStressed ? 'pulse 2s ease-in-out infinite' : 'none',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.005)' },
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '1rem' }}>
          {message.startsWith('🚨') 
            ? 'Immediate Action Required' 
            : severity === 'error' 
              ? 'Critical Workload!' 
              : 'Heads Up!'}
        </AlertTitle>
        <Box sx={{ fontSize: '0.95rem' }}>{message}</Box>
      </Alert>
    </Collapse>
  );
}
