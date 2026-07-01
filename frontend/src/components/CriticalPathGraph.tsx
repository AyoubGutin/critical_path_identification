import { useEffect, useRef, useCallback } from 'react';
import { Network } from 'vis-network';
import { AnalysisResult } from '../types';
import { useGraphData, GRAPH_OPTIONS } from './graphUtils';

interface CriticalPathGraphProps {
  result: AnalysisResult;
}

const GRAPH_HEIGHT = 500;

/**
 * CriticalPathGraph Component
 *
 * Renders a directed graph vis of the project's critical path
 * using vis-network. Nodes represent tasks and edges show dependencies.
 */
export function CriticalPathGraph({ result }: CriticalPathGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const { nodes, edges } = useGraphData(result);

  const cleanup = useCallback(() => {
    if (networkRef.current) {
      networkRef.current.destroy();
      networkRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create new network instance
    const network = new Network(
      containerRef.current,
      { nodes, edges },
      GRAPH_OPTIONS,
    );
    networkRef.current = network;

    return cleanup;
  }, [nodes, edges, cleanup]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: `${GRAPH_HEIGHT}px` }}
    />
  );
}
