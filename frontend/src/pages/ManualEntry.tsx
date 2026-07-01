import { useState, useCallback, useRef, useEffect } from 'react';
import { Stack, Alert } from '@chakra-ui/react';
import { api } from '../api';
import { TaskInput, AnalysisResult } from '../types';
import { TaskInputForm } from '../components/TaskInputForm';
import { TaskListTable } from '../components/TaskListTable';
import { getNextTaskId } from '../components/taskUtils';

interface ManualEntryProps {
  onAnalyse: (result: AnalysisResult) => void;
  onError: (error: string) => void;
}

export function ManualEntry({ onAnalyse, onError }: ManualEntryProps) {
  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);
    onError(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
      errorTimeoutRef.current = null;
    }, 5000);
  }, [onError]);

  const handleAddTask = useCallback((task: TaskInput) => {
    setTasks((prev) => [...prev, task]);
    setError(null);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      const reIndexed = filtered.map((task, idx) => ({
        ...task,
        id: getNextTaskId(idx),
      }));
      return reIndexed;
    });
  }, []);

  const handleClear = useCallback(() => {
    setTasks([]);
    setError(null);
  }, []);

  const handleAnalyse = useCallback(async () => {
    if (tasks.length === 0) {
      showError('Please add at least one task before analysing.');
      return;
    }

    // Validate tasks
    for (const task of tasks) {
      if (!task.name || task.name.trim() === '') {
        showError('All tasks must have a name.');
        return;
      }
      if (task.optimistic < 0 || task.most_likely < 0 || task.pessimistic < 0) {
        showError('Duration values cannot be negative.');
        return;
      }
      if (task.optimistic > task.pessimistic) {
        showError('Optimistic value cannot be greater than Pessimistic.');
        return;
      }
    }

    setIsAnalysing(true);
    try {
      const response = await api.analyseProject(tasks);
      onAnalyse(response);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      const message = error?.response?.data?.detail || error?.message || 'Analysis failed. Please try again.';
      showError(message);
    } finally {
      setIsAnalysing(false);
    }
  }, [tasks, onAnalyse, showError]);

  return (
    <Stack gap="8">
      {error && (
        <Alert status="error" variant="subtle">
          {error}
        </Alert>
      )}

      <TaskInputForm tasks={tasks} onAddTask={handleAddTask} />

      {tasks.length > 0 && (
        <TaskListTable
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onClearAll={handleClear}
          onAnalyse={handleAnalyse}
          isAnalysing={isAnalysing}
        />
      )}
    </Stack>
  );
}
