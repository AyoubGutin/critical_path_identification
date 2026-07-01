import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Field,
  HStack,
  Input,
  Stack,
  Text,
  Grid,
  Portal,
  Select,
  Alert,
} from '@chakra-ui/react';
import { TaskInput } from '../types';
import { LuPlus } from 'react-icons/lu';
import { createListCollection } from '@chakra-ui/react';
import { getNextTaskId } from './taskUtils';

interface TaskInputFormProps {
  tasks: TaskInput[];
  onAddTask: (task: TaskInput) => void;
}

export function TaskInputForm({ tasks, onAddTask }: TaskInputFormProps) {
  const [currentTask, setCurrentTask] = useState<Omit<TaskInput, 'id'>>({
    name: '',
    optimistic: 0,
    most_likely: 0,
    pessimistic: 0,
    predecessors: [],
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const nextAssignedId = getNextTaskId(tasks.length);

  const tasksCollection = useMemo(
    () =>
      createListCollection({
        items: tasks.map((task) => ({
          label: `${task.id}: ${task.name}`,
          value: task.id,
        })),
      }),
    [tasks],
  );

  const validateTask = (): boolean => {
    if (!currentTask.name.trim()) {
      setValidationError('Task name is required');
      return false;
    }
    if (currentTask.optimistic < 0 || currentTask.most_likely < 0 || currentTask.pessimistic < 0) {
      setValidationError('Duration values cannot be negative');
      return false;
    }
    if (currentTask.optimistic > currentTask.pessimistic) {
      setValidationError('Optimistic cannot be greater than Pessimistic');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleAddTask = () => {
    if (!validateTask()) return;

    const newTask: TaskInput = {
      ...currentTask,
      id: nextAssignedId,
    };

    onAddTask(newTask);
    setCurrentTask({
      name: '',
      optimistic: 0,
      most_likely: 0,
      pessimistic: 0,
      predecessors: [],
    });
    setValidationError(null);
  };

  return (
    <Stack gap="4">
      <Box>
        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Add New Task
        </Text>
      </Box>

      <Stack gap="3">
        {validationError && (
          <Alert status="error" variant="subtle" fontSize="sm">
            {validationError}
          </Alert>
        )}

        <Grid templateColumns="1fr 1fr" gap="3">
          <Field.Root invalid={!!validationError && !currentTask.name.trim()}>
            <Field.Label>Task Name</Field.Label>
            <Input
              placeholder="Enter task name"
              value={currentTask.name}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, name: e.target.value })
              }
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Predecessors</Field.Label>
            {tasks.length > 0 ? (
              <Select.Root
                collection={tasksCollection}
                multiple
                value={currentTask.predecessors}
                onValueChange={(details) =>
                  setCurrentTask({
                    ...currentTask,
                    predecessors: details.value,
                  })
                }
                positioning={{ sameWidth: true }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select..." />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {tasksCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            ) : (
              <Select.Root disabled>
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText>—</Select.ValueText>
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
              </Select.Root>
            )}
          </Field.Root>
        </Grid>

        <Grid templateColumns="repeat(3, 1fr)" gap="3">
          <Field.Root invalid={!!validationError && currentTask.optimistic < 0}>
            <Field.Label>Optimistic (days)</Field.Label>
            <Input
              type="number"
              min="0"
              value={currentTask.optimistic || ''}
              onChange={(e) =>
                setCurrentTask({
                  ...currentTask,
                  optimistic: Number(e.target.value) || 0,
                })
              }
            />
          </Field.Root>
          <Field.Root invalid={!!validationError && currentTask.most_likely < 0}>
            <Field.Label>Most Likely (days)</Field.Label>
            <Input
              type="number"
              min="0"
              value={currentTask.most_likely || ''}
              onChange={(e) =>
                setCurrentTask({
                  ...currentTask,
                  most_likely: Number(e.target.value) || 0,
                })
              }
            />
          </Field.Root>
          <Field.Root invalid={!!validationError && currentTask.pessimistic < 0}>
            <Field.Label>Pessimistic (days)</Field.Label>
            <Input
              type="number"
              min="0"
              value={currentTask.pessimistic || ''}
              onChange={(e) =>
                setCurrentTask({
                  ...currentTask,
                  pessimistic: Number(e.target.value) || 0,
                })
              }
            />
          </Field.Root>
        </Grid>

        <HStack justify="flex-start">
          <Button
            bg="fg"
            color="bg"
            size="sm"
            onClick={handleAddTask}
            disabled={!currentTask.name.trim()}
            _hover={{ bg: 'fg.muted' }}
          >
            <LuPlus /> Add Task
          </Button>
        </HStack>
      </Stack>
    </Stack>
  );
}
