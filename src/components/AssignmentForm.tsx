'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Assignment, AssignmentFormData } from '@/types/assignment';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { formatForDateTimeLocal, getDefaultDeadline } from '@/lib/utils';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  subject: z.string().min(1, 'Subject is required').max(50, 'Subject too long'),
  description: z.string().max(500, 'Description too long').optional().or(z.literal('')),
  deadline: z.string().min(1, 'Deadline is required'),
  priority: z.enum(['low', 'medium', 'high']),
});

interface AssignmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AssignmentFormData) => Promise<{ error: string | null }>;
  editingAssignment?: Assignment | null;
}

export default function AssignmentForm({
  open,
  onClose,
  onSubmit,
  editingAssignment,
}: AssignmentFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      deadline: getDefaultDeadline(),
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (editingAssignment) {
      reset({
        title: editingAssignment.title,
        subject: editingAssignment.subject,
        description: editingAssignment.description || '',
        deadline: editingAssignment.deadline
          ? formatForDateTimeLocal(editingAssignment.deadline)
          : '',
        priority: editingAssignment.priority,
      });
    } else {
      reset({
        title: '',
        subject: '',
        description: '',
        deadline: getDefaultDeadline(),
        priority: 'medium',
      });
    }
  }, [editingAssignment, reset, open]);

  const handleFormSubmit = async (data: AssignmentFormData) => {
    // Ensure deadline is a proper ISO string with timezone info
    const utcDeadline = new Date(data.deadline).toISOString();
    const result = await onSubmit({ ...data, deadline: utcDeadline });
    if (!result.error) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 1,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {editingAssignment
                ? 'Update your assignment details'
                : 'Add a new assignment to your tracker'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  placeholder="e.g., Math Homework Chapter 5"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject"
                  placeholder="e.g., Mathematics"
                  fullWidth
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (optional)"
                  placeholder="Any additional notes..."
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Deadline"
                  type="datetime-local"
                  fullWidth
                  error={!!errors.deadline}
                  helperText={errors.deadline?.message}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Priority"
                  fullWidth
                  error={!!errors.priority}
                  helperText={errors.priority?.message}
                >
                  <MenuItem value="low">🟢 Low</MenuItem>
                  <MenuItem value="medium">🟠 Medium</MenuItem>
                  <MenuItem value="high">🔴 High</MenuItem>
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ borderRadius: 3, minWidth: 140 }}
          >
            {isSubmitting
              ? 'Saving...'
              : editingAssignment
              ? 'Update Assignment'
              : 'Add Assignment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
