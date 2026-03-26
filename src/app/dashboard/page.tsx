'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Skeleton,
  Chip,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useAssignments } from '@/context/AssignmentContext';
import { getGreeting, getPriorityColor, getCountdown, getDeadlineSeverity } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import StressAlert from '@/components/StressAlert';
import WorkloadChart from '@/components/WorkloadChart';
import AssignmentForm from '@/components/AssignmentForm';
import AssignmentCard from '@/components/AssignmentCard';
import { AssignmentFormData } from '@/types/assignment';
import {
  Plus,
  ClipboardList,
  Clock,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Inbox,
} from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const { assignments, loading, addAssignment, updateAssignment, deleteAssignment, toggleComplete } =
    useAssignments();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<(typeof assignments)[0] | null>(null);

  const userName = user?.email?.split('@')[0] || 'Student';

  // Derived stats
  const stats = useMemo(() => {
    const pending = assignments.filter((a) => a.status === 'pending');
    const completed = assignments.filter((a) => a.status === 'completed');
    const dueSoon = pending.filter((a) => {
      const days = differenceInDays(new Date(a.deadline), new Date());
      return days >= 0 && days <= 3;
    });

    return {
      total: assignments.length,
      pending: pending.length,
      completed: completed.length,
      dueSoon: dueSoon.length,
    };
  }, [assignments]);

  // Upcoming 5 assignments (pending, sorted by deadline)
  const upcoming = useMemo(() => {
    return assignments
      .filter((a) => a.status === 'pending')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [assignments]);

  // Recent assignments (last 5)
  const recent = useMemo(() => {
    return [...assignments]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [assignments]);

  const handleSubmit = async (data: AssignmentFormData) => {
    if (editingAssignment) {
      return updateAssignment(editingAssignment.id, data);
    }
    return addAssignment(data);
  };

  const handleEdit = (assignment: (typeof assignments)[0]) => {
    setEditingAssignment(assignment);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteAssignment(id);
  };

  const handleToggle = async (id: string, status: string) => {
    await toggleComplete(id, status);
  };

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ClipboardList,
      color: '#7C4DFF',
      bg: 'rgba(124,77,255,0.1)',
    },
    {
      label: 'Due Soon',
      value: stats.dueSoon,
      icon: Clock,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: '#22C55E',
      bg: 'rgba(34,197,94,0.1)',
    },
    {
      label: 'In Progress',
      value: stats.pending,
      icon: TrendingUp,
      color: '#00E5FF',
      bg: 'rgba(0,229,255,0.1)',
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
              {getGreeting()}, {userName} 👋
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Here&apos;s your academic overview for today
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
            Add Assignment
          </Button>
        </Stack>

        {/* Stress Alert */}
        <StressAlert assignments={assignments} />

        {/* Stats Grid */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {statCards.map((stat, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={i}>
              {loading ? (
                <Skeleton variant="rounded" height={120} sx={{ borderRadius: 5 }} />
              ) : (
                <Card
                  sx={{
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 30px ${stat.color}15`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}
                        >
                          {stat.label}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color, mt: 0.5 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: stat.bg,
                        }}
                      >
                        <stat.icon size={22} color={stat.color} />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Workload Chart */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <TrendingUp size={20} color="#7C4DFF" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Weekly Workload
                  </Typography>
                </Stack>
                {loading ? (
                  <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
                ) : (
                  <WorkloadChart assignments={assignments} />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Deadlines */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Clock size={20} color="#F59E0B" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Upcoming Deadlines
                  </Typography>
                </Stack>
                {loading ? (
                  <Stack spacing={1.5}>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 3 }} />
                    ))}
                  </Stack>
                ) : upcoming.length === 0 ? (
                  <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
                    <Inbox size={40} color="#94A3B8" />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No upcoming deadlines. You&apos;re all caught up! 🎉
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={1.5}>
                    {upcoming.map((assignment) => {
                      const severity = getDeadlineSeverity(assignment.deadline);
                      const severityColors: Record<string, string> = {
                        overdue: '#EF4444',
                        urgent: '#F59E0B',
                        soon: '#F59E0B',
                        normal: '#94A3B8',
                      };

                      return (
                        <Box
                          key={assignment.id}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: 'rgba(148,163,184,0.04)',
                            border: '1px solid rgba(148,163,184,0.06)',
                            transition: 'all 0.2s',
                            '&:hover': {
                              background: 'rgba(148,163,184,0.08)',
                              borderColor: 'rgba(124,77,255,0.15)',
                            },
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {assignment.title}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <BookOpen size={12} color="#94A3B8" />
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {assignment.subject}
                                  </Typography>
                                </Stack>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  ·
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {format(new Date(assignment.deadline), 'MMM dd')}
                                </Typography>
                              </Stack>
                            </Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1, flexShrink: 0 }}>
                              <Chip
                                label={assignment.priority}
                                size="small"
                                color={getPriorityColor(assignment.priority)}
                                sx={{ fontSize: '0.7rem', height: 22, textTransform: 'capitalize' }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 700,
                                  color: severityColors[severity],
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {getCountdown(assignment.deadline)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Assignments */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ClipboardList size={20} color="#7C4DFF" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Recent Assignments
                    </Typography>
                  </Stack>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => (window.location.href = '/assignments')}
                    sx={{ color: 'primary.light', fontWeight: 600 }}
                  >
                    View All →
                  </Button>
                </Stack>
                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 4 }} />
                    ))}
                  </Stack>
                ) : recent.length === 0 ? (
                  <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
                    <Inbox size={48} color="#94A3B8" />
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      No assignments yet
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Plus size={18} />}
                      onClick={() => {
                        setEditingAssignment(null);
                        setFormOpen(true);
                      }}
                    >
                      Add your first assignment
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {recent.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleComplete={handleToggle}
                      />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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
