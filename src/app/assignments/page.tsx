'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Chip,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Skeleton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAssignments } from '@/context/AssignmentContext';
import Navbar from '@/components/Navbar';
import AssignmentCard from '@/components/AssignmentCard';
import AssignmentForm from '@/components/AssignmentForm';
import { Assignment, AssignmentFormData } from '@/types/assignment';
import { Plus, Search, SortAsc, Inbox, Filter } from 'lucide-react';
import { differenceInDays } from 'date-fns';

type FilterType = 'all' | 'due-soon' | 'high-priority' | 'completed';
type SortType = 'deadline' | 'priority' | 'created';

export default function AssignmentsPage() {
  const { assignments, loading, addAssignment, updateAssignment, deleteAssignment, toggleComplete } =
    useAssignments();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('deadline');
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Priority weight for sorting
  const priorityWeight = { high: 3, medium: 2, low: 1 };

  // Filtered + sorted assignments
  const filteredAssignments = useMemo(() => {
    let result = [...assignments];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    switch (filter) {
      case 'due-soon':
        result = result.filter((a) => {
          const days = differenceInDays(new Date(a.deadline), new Date());
          return a.status === 'pending' && days >= 0 && days <= 3;
        });
        break;
      case 'high-priority':
        result = result.filter((a) => a.priority === 'high' && a.status === 'pending');
        break;
      case 'completed':
        result = result.filter((a) => a.status === 'completed');
        break;
    }

    // Sort
    switch (sortBy) {
      case 'deadline':
        result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'priority':
        result.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
        break;
      case 'created':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [assignments, filter, sortBy, search, priorityWeight]);

  const handleSubmit = async (data: AssignmentFormData) => {
    if (editingAssignment) {
      return updateAssignment(editingAssignment.id, data);
    }
    return addAssignment(data);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await deleteAssignment(deletingId);
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleToggle = async (id: string, status: string) => {
    await toggleComplete(id, status);
  };

  const filterChips: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: assignments.length },
    {
      key: 'due-soon',
      label: 'Due Soon',
      count: assignments.filter((a) => {
        const days = differenceInDays(new Date(a.deadline), new Date());
        return a.status === 'pending' && days >= 0 && days <= 3;
      }).length,
    },
    {
      key: 'high-priority',
      label: 'High Priority',
      count: assignments.filter((a) => a.priority === 'high' && a.status === 'pending').length,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: assignments.filter((a) => a.status === 'completed').length,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 0.5,
                background: 'linear-gradient(135deg, #F1F5F9, #B47CFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Assignments
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage all your assignments in one place
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => {
              setEditingAssignment(null);
              setFormOpen(true);
            }}
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            New Assignment
          </Button>
        </Stack>

        {/* Filters & Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Stack spacing={2}>
              {/* Search */}
              <TextField
                placeholder="Search assignments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} color="#94A3B8" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ maxWidth: { md: 400 } }}
              />

              {/* Filter chips + Sort */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
              >
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Filter size={16} color="#94A3B8" />
                  {filterChips.map((chip) => (
                    <Chip
                      key={chip.key}
                      label={`${chip.label} (${chip.count})`}
                      onClick={() => setFilter(chip.key)}
                      variant={filter === chip.key ? 'filled' : 'outlined'}
                      color={filter === chip.key ? 'primary' : 'default'}
                      size="small"
                      sx={{
                        borderColor:
                          filter === chip.key ? 'primary.main' : 'rgba(148,163,184,0.15)',
                        fontWeight: filter === chip.key ? 700 : 500,
                      }}
                    />
                  ))}
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <SortAsc size={16} color="#94A3B8" />
                  <TextField
                    select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortType)}
                    size="small"
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="deadline">By Deadline</MenuItem>
                    <MenuItem value="priority">By Priority</MenuItem>
                    <MenuItem value="created">By Date Added</MenuItem>
                  </TextField>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Assignments List */}
        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rounded" height={85} sx={{ borderRadius: 4 }} />
            ))}
          </Stack>
        ) : filteredAssignments.length === 0 ? (
          <Card>
            <CardContent>
              <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
                <Inbox size={56} color="#94A3B8" />
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {search || filter !== 'all' ? 'No matching assignments' : 'No assignments yet'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, textAlign: 'center' }}>
                  {search || filter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Create your first assignment to get started tracking your academic workload'}
                </Typography>
                {filter === 'all' && !search && (
                  <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    onClick={() => {
                      setEditingAssignment(null);
                      setFormOpen(true);
                    }}
                  >
                    Add Assignment
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onToggleComplete={handleToggle}
              />
            ))}
          </Stack>
        )}

        {/* Results summary */}
        {!loading && filteredAssignments.length > 0 && (
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'block', mt: 2, textAlign: 'center' }}
          >
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </Typography>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Delete Assignment</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assignment Form Dialog */}
        <AssignmentForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingAssignment(null);
          }}
          onSubmit={handleSubmit}
          editingAssignment={editingAssignment}
        />
      </Container>
    </Box>
  );
}
