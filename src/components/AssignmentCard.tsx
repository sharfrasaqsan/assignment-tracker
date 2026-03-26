'use client';

import { Chip, Box, Typography, IconButton, Card, CardContent, Stack, Tooltip } from '@mui/material';
import { Assignment } from '@/types/assignment';
import { getCountdown, getPriorityColor, getDeadlineSeverity } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, Edit2, Trash2, RotateCcw, Clock, BookOpen } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, status: string) => void;
}

export default function AssignmentCard({
  assignment,
  onEdit,
  onDelete,
  onToggleComplete,
}: AssignmentCardProps) {
  const countdown = getCountdown(assignment.deadline);
  const severity = getDeadlineSeverity(assignment.deadline);
  const isCompleted = assignment.status === 'completed';

  const severityColors = {
    overdue: '#EF4444',
    urgent: '#F59E0B',
    soon: '#F59E0B',
    normal: '#94A3B8',
  };

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        opacity: isCompleted ? 0.6 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(124, 77, 255, 0.2)',
        },
        '&::before': isCompleted
          ? {}
          : {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: severityColors[severity],
              borderRadius: '4px 0 0 4px',
            },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: isCompleted ? 'text.secondary' : 'text.primary',
                  textDecoration: isCompleted ? 'line-through' : 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {assignment.title}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              {assignment.subject && (
                <Chip
                  icon={<BookOpen size={14} />}
                  label={assignment.subject}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: 'rgba(148,163,184,0.2)', color: 'text.secondary', fontSize: '0.75rem' }}
                />
              )}
              <Chip
                label={assignment.priority}
                size="small"
                color={getPriorityColor(assignment.priority)}
                sx={{ fontSize: '0.75rem', textTransform: 'capitalize' }}
              />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Clock size={14} color={severityColors[severity]} />
                <Typography
                  variant="caption"
                  sx={{
                    color: isCompleted ? 'success.main' : severityColors[severity],
                    fontWeight: 600,
                  }}
                >
                  {isCompleted ? 'Completed' : countdown}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {format(new Date(assignment.deadline), 'MMM dd, yyyy · h:mm a')}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
            <Tooltip title={isCompleted ? 'Mark as pending' : 'Mark as complete'}>
              <IconButton
                size="small"
                onClick={() => onToggleComplete(assignment.id, assignment.status)}
                sx={{
                  color: isCompleted ? 'warning.main' : 'success.main',
                  '&:hover': { background: isCompleted ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)' },
                }}
              >
                {isCompleted ? <RotateCcw size={18} /> : <Check size={18} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(assignment)}
                sx={{ color: 'primary.light', '&:hover': { background: 'rgba(124,77,255,0.1)' } }}
              >
                <Edit2 size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(assignment.id)}
                sx={{ color: 'error.light', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}
              >
                <Trash2 size={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
