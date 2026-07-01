import {
  Box,
  Button,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AnalysisResult } from '../types';
import { LuArrowLeft } from 'react-icons/lu';
import { CriticalPathGraph } from '../components/CriticalPathGraph';
import { Link } from 'react-router-dom';

interface ResultsProps {
  result: AnalysisResult;
}

export function Results({ result }: ResultsProps) {
  const criticalTasks = result.critical_path.length;
  const totalTasks = Object.keys(result.tasks).length;
  const avgFloat = Object.values(result.tasks)
    .reduce((sum, t) => sum + t.float, 0) / totalTasks;

  return (
    <Stack gap="10">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <Button
          as={Link}
          to="/manual"
          variant="ghost"
          color="fg.muted"
        >
          <LuArrowLeft /> Back
        </Button>
        <Heading size="lg" fontWeight="medium">
          Analysis Results
        </Heading>
        <Box w="20" />
      </HStack>

      {/* Metrics Dashboard */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="8">
        <Stack gap="1">
          <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
            Total Duration
          </Text>
          <Text fontSize="3xl" fontWeight="light" color="fg">
            {result.total_duration}
          </Text>
          <Text fontSize="sm" color="fg.muted">days</Text>
        </Stack>

        <Stack gap="1">
          <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
            Critical Tasks
          </Text>
          <Text fontSize="3xl" fontWeight="light" color="fg">
            {criticalTasks}
          </Text>
          <Text fontSize="sm" color="fg.muted">of {totalTasks} total</Text>
        </Stack>

        <Stack gap="1">
          <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
            Slack Tasks
          </Text>
          <Text fontSize="3xl" fontWeight="light" color="fg">
            {totalTasks - criticalTasks}
          </Text>
          <Text fontSize="sm" color="fg.muted">with float</Text>
        </Stack>

        <Stack gap="1">
          <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
            Avg Float
          </Text>
          <Text fontSize="3xl" fontWeight="light" color="fg">
            {avgFloat.toFixed(2)}
          </Text>
          <Text fontSize="sm" color="fg.muted">days per task</Text>
        </Stack>
      </SimpleGrid>

      {/* Visualization */}
      <Stack gap="3">
        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Critical Path
        </Text>
        <Box borderWidth="1px" borderColor="border" borderRadius="lg" overflow="hidden">
          <CriticalPathGraph result={result} />
        </Box>
      </Stack>

      {/* Detailed Table */}
      <Stack gap="3">
        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Task Details
        </Text>
        <Box overflowX="auto">
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--chakra-colors-border)',
                }}
              >
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                  Task
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                  Dur
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                  ES
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                  EF
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                  LS
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                  LF
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                  Float
                </th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, color: 'var(--chakra-colors-fg-muted)' }}>
                  Critical
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.tasks).map(([id, task]) => (
                <tr
                  key={id}
                  style={{
                    borderBottom: '1px solid var(--chakra-colors-border)',
                  }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                    {task.name}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{task.duration.toFixed(1)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{task.es.toFixed(1)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{task.ef.toFixed(1)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{task.ls.toFixed(1)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{task.lf.toFixed(1)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{task.float.toFixed(1)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {result.critical_path.includes(id) ? (
                      <Text fontSize="xs" fontWeight="medium" color="red.500">
                        Critical
                      </Text>
                    ) : (
                      <Text fontSize="xs" color="fg.muted">
                        {task.float.toFixed(1)}d
                      </Text>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Stack>
    </Stack>
  );
}
