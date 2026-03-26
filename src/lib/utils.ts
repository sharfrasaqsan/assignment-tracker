import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isPast,
  startOfDay,
  addDays,
  format,
  isToday,
  isTomorrow,
} from 'date-fns';
import { Assignment, Priority } from '@/types/assignment';

/**
 * Priority weight mapping for workload calculations.
 * low=1, medium=2, high=3
 */
const PRIORITY_WEIGHT: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * Returns a human-readable countdown string for a given deadline.
 *
 * Examples:
 * - "Overdue" (past deadline)
 * - "Due today"
 * - "Due tomorrow"
 * - "5 hours left"
 * - "Due in 3 days"
 */
export function getCountdown(deadline: string): string {
  const now = new Date();
  const deadlineDate = new Date(deadline);

  if (isPast(deadlineDate)) {
    return 'Overdue';
  }

  if (isToday(deadlineDate)) {
    const hoursLeft = differenceInHours(deadlineDate, now);
    if (hoursLeft < 1) {
      const minutesLeft = differenceInMinutes(deadlineDate, now);
      return `${minutesLeft} min left`;
    }
    return `${hoursLeft} hours left`;
  }

  if (isTomorrow(deadlineDate)) {
    return 'Due tomorrow';
  }

  const daysLeft = differenceInDays(deadlineDate, now);
  return `Due in ${daysLeft} days`;
}

/**
 * Returns a severity level based on how close the deadline is:
 * - "overdue" → past
 * - "urgent" → within 1 day
 * - "soon" → within 3 days
 * - "normal" → everything else
 */
export function getDeadlineSeverity(deadline: string): 'overdue' | 'urgent' | 'soon' | 'normal' {
  const now = new Date();
  const deadlineDate = new Date(deadline);

  if (isPast(deadlineDate)) return 'overdue';

  const daysLeft = differenceInDays(deadlineDate, now);
  if (daysLeft <= 1) return 'urgent';
  if (daysLeft <= 3) return 'soon';
  return 'normal';
}

/**
 * Calculates the weekly workload distribution for the next 7 days.
 *
 * Returns an array of 7 objects, each with:
 * - day: abbreviated day name (Mon, Tue, ...)
 * - date: full date string
 * - score: sum of priority weights for assignments due on that day
 * - count: number of assignments due on that day
 *
 * Workload score per assignment:
 * - low priority = 1
 * - medium priority = 2
 * - high priority = 3
 */
export function calculateWorkload(assignments: Assignment[]) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return {
      day: format(date, 'EEE'),
      date: format(date, 'MMM dd'),
      fullDate: date,
      score: 0,
      count: 0,
    };
  });

  // Only consider pending assignments
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');

  pendingAssignments.forEach((assignment) => {
    const deadlineDate = startOfDay(new Date(assignment.deadline));
    const dayIndex = days.findIndex(
      (d) => format(d.fullDate, 'yyyy-MM-dd') === format(deadlineDate, 'yyyy-MM-dd')
    );

    if (dayIndex !== -1) {
      days[dayIndex].score += PRIORITY_WEIGHT[assignment.priority];
      days[dayIndex].count += 1;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return days.map(({ fullDate, ...rest }) => rest);
}

/**
 * Stress Detection Logic
 *
 * Analyzes upcoming assignments and determines if the user is under stress.
 *
 * Trigger conditions:
 * 1. ≥3 assignments due within 3 days
 * 2. OR ≥2 high priority tasks due within 2 days
 *
 * Returns:
 * - isStressed: boolean flag
 * - message: human-readable alert message
 * - severity: 'warning' | 'error' (error for extreme stress)
 */
export function getStressAlert(assignments: Assignment[]): {
  isStressed: boolean;
  message: string;
  severity: 'warning' | 'error';
} {
  const now = new Date();
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');

  // Count assignments due within 1 hour (notify)
  const dueWithin1Hour = pendingAssignments.filter((a) => {
    const deadline = new Date(a.deadline);
    const minutesUntil = differenceInMinutes(deadline, now);
    return minutesUntil >= 0 && minutesUntil <= 60;
  });

  // Count assignments due within 3 days
  const dueWithin3Days = pendingAssignments.filter((a) => {
    const deadline = new Date(a.deadline);
    const daysUntil = differenceInDays(deadline, now);
    return daysUntil >= 0 && daysUntil <= 3;
  });

  // Count high priority assignments due within 2 days
  const highPriorityDueWithin2Days = pendingAssignments.filter((a) => {
    const deadline = new Date(a.deadline);
    const daysUntil = differenceInDays(deadline, now);
    return a.priority === 'high' && daysUntil >= 0 && daysUntil <= 2;
  });

  // Check for immediate deadline (within 1 hour)
  if (dueWithin1Hour.length > 0) {
    return {
      isStressed: true,
      message: `🚨 IMMEDIATE ACTION REQUIRED: The assignment "${dueWithin1Hour[0].title}" is due in less than 1 hour!`,
      severity: 'error',
    };
  }

  // Check for extreme stress (both conditions met)
  if (dueWithin3Days.length >= 3 && highPriorityDueWithin2Days.length >= 2) {
    return {
      isStressed: true,
      message: `🔴 High Stress Alert: ${dueWithin3Days.length} deadlines in the next 3 days, including ${highPriorityDueWithin2Days.length} high-priority tasks!`,
      severity: 'error',
    };
  }

  // Check condition 1: ≥3 assignments due within 3 days
  if (dueWithin3Days.length >= 3) {
    return {
      isStressed: true,
      message: `⚠️ Stress Alert: ${dueWithin3Days.length} deadlines in the next 3 days. Plan your time wisely!`,
      severity: 'warning',
    };
  }

  // Check condition 2: ≥2 high priority tasks due within 2 days
  if (highPriorityDueWithin2Days.length >= 2) {
    return {
      isStressed: true,
      message: `⚠️ Stress Alert: ${highPriorityDueWithin2Days.length} high-priority tasks due in the next 2 days!`,
      severity: 'warning',
    };
  }

  return {
    isStressed: false,
    message: '',
    severity: 'warning',
  };
}

/**
 * Returns a greeting based on current time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Returns the priority color for chips
 */
export function getPriorityColor(priority: Priority): 'success' | 'warning' | 'error' {
  switch (priority) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
  }
}

/**
 * Returns assignments due within the next hour
 */
export function getImminentDeadlines(assignments: Assignment[]): Assignment[] {
  const now = new Date();
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');
  return pendingAssignments.filter((a) => {
    const deadline = new Date(a.deadline);
    const minutesUntil = differenceInMinutes(deadline, now);
    return minutesUntil >= 0 && minutesUntil <= 60;
  });
}
/**
 * Formats a date string for use in a datetime-local input.
 * Ensures the value reflects the user's local time correctly.
 */
export function formatForDateTimeLocal(dateInput: string | Date | null): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
/**
 * Returns a default deadline string (1 hour from now) in local YYYY-MM-DDTHH:mm format.
 */
export function getDefaultDeadline(): string {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  return formatForDateTimeLocal(d);
}
