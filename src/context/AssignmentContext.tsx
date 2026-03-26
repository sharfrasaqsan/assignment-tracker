'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { Assignment, AssignmentFormData } from '@/types/assignment';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';
import { getImminentDeadlines } from '@/lib/utils';

interface AssignmentContextType {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  addAssignment: (data: AssignmentFormData) => Promise<{ error: string | null }>;
  updateAssignment: (id: string, data: Partial<AssignmentFormData & { status: string }>) => Promise<{ error: string | null }>;
  deleteAssignment: (id: string) => Promise<{ error: string | null }>;
  toggleComplete: (id: string, currentStatus: string) => Promise<{ error: string | null }>;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();
  const notifiedRef = useRef<Set<string>>(new Set());

  // Browser Notification Logic
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    // Check if assignments is empty or loading
    if (assignments.length === 0) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkDeadlines = () => {
      const imminent = getImminentDeadlines(assignments);
      imminent.forEach((a) => {
        if (!notifiedRef.current.has(a.id)) {
          if (Notification.permission === 'granted') {
            new Notification('⚠️ Deadline Approaching!', {
              body: `"${a.title}" is due in less than 1 hour. Finish it now!`,
              icon: '/favicon.ico',
            });
            notifiedRef.current.add(a.id);
          }
        }
      });
    };

    // Check every 1 minute for imminent deadlines
    // Using a shorter interval for better responsiveness
    const interval = setInterval(checkDeadlines, 60 * 1000);
    checkDeadlines(); // Run once on state change

    return () => clearInterval(interval);
  }, [assignments]);
  

  const fetchAssignments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('assignments')
      .select('*')
      .eq('user_id', user.id)
      .order('deadline', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setAssignments(data || []);
    }
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    } else {
      setAssignments([]);
      setLoading(false);
    }
  }, [user, fetchAssignments]);

  const addAssignment = useCallback(async (data: AssignmentFormData) => {
    if (!user) return { error: 'Not authenticated' };

    const { error: insertError } = await supabase
      .from('assignments')
      .insert({
        ...data,
        user_id: user.id,
        status: 'pending',
      });

    if (insertError) return { error: insertError.message };
    await fetchAssignments();
    return { error: null };
  }, [user, supabase, fetchAssignments]);

  const updateAssignment = useCallback(async (id: string, data: Partial<AssignmentFormData & { status: string }>) => {
    const { error: updateError } = await supabase
      .from('assignments')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) return { error: updateError.message };
    await fetchAssignments();
    return { error: null };
  }, [supabase, fetchAssignments]);

  const deleteAssignment = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);

    if (deleteError) return { error: deleteError.message };
    await fetchAssignments();
    return { error: null };
  }, [supabase, fetchAssignments]);

  const toggleComplete = useCallback(async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    return updateAssignment(id, { status: newStatus });
  }, [updateAssignment]);

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        loading,
        error,
        fetchAssignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleComplete,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
}
