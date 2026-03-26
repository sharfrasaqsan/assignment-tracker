'use client';

import { Typography, Stack, Box, Chip } from '@mui/material';
import { Assignment } from '@/types/assignment';
import { getCountdown, getPriorityColor, getDeadlineSeverity } from '@/lib/utils';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';

interface CountdownTimerProps {
  assignment: Assignment;
  compact?: boolean;
}

export default function CountdownTimer({ assignment, compact = false }: CountdownTimerProps) {
  const countdown = getCountdown(assignment.deadline);
  const severity = getDeadlineSeverity(assignment.deadline);
  const isCompleted = assignment.status === 'completed';

  const severityStyles = {
    overdue: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    urgent: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    soon: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    normal: { color: '#94A3B8', bg: 'transparent' },
  };

  if (compact) {
    return (
      <Chip
        icon={<Clock size={14} />}
        label={isCompleted ? 'Completed' : countdown}
        size="small"
        sx={{
          fontWeight: 600,
          color: isCompleted ? 'success.main' : severityStyles[severity].color,
          bgcolor: isCompleted ? 'rgba(34,197,94,0.1)' : severityStyles[severity].bg,
          border: 'none',
          fontSize: '0.75rem',
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        background: isCompleted
          ? 'rgba(34,197,94,0.05)'
          : severityStyles[severity].bg,
        border: `1px solid ${
          isCompleted
            ? 'rgba(34,197,94,0.15)'
            : severityStyles[severity].color + '20'
        }`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Clock
            size={18}
            color={isCompleted ? '#22C55E' : severityStyles[severity].color}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: isCompleted ? 'success.main' : severityStyles[severity].color,
            }}
          >
            {isCompleted ? 'Completed ✓' : countdown}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Calendar size={14} color="#94A3B8" />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {format(new Date(assignment.deadline), 'MMM dd, h:mm a')}
          </Typography>
        </Stack>
      </Stack>

      {!compact && !isCompleted && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {assignment.title}
          </Typography>
          <Chip
            label={assignment.priority}
            size="small"
            color={getPriorityColor(assignment.priority)}
            sx={{ fontSize: '0.65rem', height: 20, textTransform: 'capitalize' }}
          />
        </Stack>
      )}
    </Box>
  );
}
