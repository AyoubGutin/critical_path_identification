import {
  Button,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { TaskInput } from '../types';
import { LuTrash2 } from 'react-icons/lu';

interface TaskListTableProps {
  tasks: TaskInput[];
  onDeleteTask: (id: string) => void;
  onClearAll: () => void;
  onAnalyse: () => void;
  isAnalysing: boolean;
}

export function TaskListTable({
  tasks,
  onDeleteTask,
  onClearAll,
  onAnalyse,
  isAnalysing,
}: TaskListTableProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Tasks ({tasks.length})
        </Text>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--chakra-colors-border)' }}>
              <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                ID
              </th>
              <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                Name
              </th>
              <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                Opt
              </th>
              <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                ML
              </th>
              <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                Pes
              </th>
              <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                Preds
              </th>
              <th style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                style={{ borderBottom: '1px solid var(--chakra-colors-border)' }}
              >
                <td style={{ padding: '0.5rem 1rem', fontWeight: 500 }}>
                  {task.id}
                </td>
                <td style={{ padding: '0.5rem 1rem' }}>{task.name}</td>
                <td style={{ padding: '0.5rem 1rem' }}>{task.optimistic}</td>
                <td style={{ padding: '0.5rem 1rem' }}>{task.most_likely}</td>
                <td style={{ padding: '0.5rem 1rem' }}>{task.pessimistic}</td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  {task.predecessors.length > 0 ? (
                    <Text fontSize="xs" color="fg.muted">
                      {task.predecessors.join(', ')}
                    </Text>
                  ) : (
                    <Text fontSize="xs" color="fg.muted">—</Text>
                  )}
                </td>
                <td style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <LuTrash2 />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HStack justify="flex-end">
        <Button
          bg="fg"
          color="bg"
          onClick={onAnalyse}
          loading={isAnalysing}
          loadingText="Analysing..."
          _hover={{ bg: 'fg.muted' }}
        >
          Analyse Project
        </Button>
      </HStack>
    </div>
  );
}
