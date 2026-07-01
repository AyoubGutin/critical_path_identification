import { useMemo } from 'react';
import { AnalysisResult } from '../types';

// Types for vis-network nodes and edges
export interface VisNode {
  id: string;
  label: string;
  title: string;
  color: {
    background: string;
    border: string;
    highlight: {
      background: string;
      border: string;
    };
  };
  font: {
    color: string;
    size: number;
  };
  borderWidth: number;
  shape: string;
  margin: { top: number; right: number; bottom: number; left: number };
}

export interface VisEdge {
  from: string;
  to: string;
  arrows: { to: { enabled: boolean; scaleFactor: number } };
  color: {
    color: string;
    highlight: string;
    hover: string;
  };
  width: number;
  dashes: boolean;
  label: string;
  font: {
    size: number;
    color: string;
    background: string;
  };
}

export interface VisData {
  nodes: VisNode[];
  edges: VisEdge[];
}

// Minimal color scheme
const COLORS = {
  critical: {
    background: '#ffffff',
    border: '#1a1a1a',
    highlight: {
      background: '#ffffff',
      border: '#000',
    },
    text: '#1a1a1a',
  },
  normal: {
    background: '#fafafa',
    border: '#d0d0d0',
    highlight: {
      background: '#ffffff',
      border: '#999',
    },
    text: '#999',
  },
} as const;

/**
 * Custom hook to transform analysis result into vis-network graph data.
 */
export function useGraphData(result: AnalysisResult): VisData {
  return useMemo(() => {
    const tasks = Object.entries(result.tasks).map(([id, task]) => ({
      ...task,
      id,
    }));

    const criticalPathSet = new Set(result.critical_path);

    // Create nodes with simple format
    const nodes: VisNode[] = tasks.map((task) => {
      const isCritical = criticalPathSet.has(task.id);
      const colors = isCritical ? COLORS.critical : COLORS.normal;

      const label = `${task.name}\n${task.es.toFixed(0)} → ${task.ef.toFixed(0)}`;

      return {
        id: task.id,
        label,
        title: `${task.name}\nDuration: ${task.duration.toFixed(1)}d\nES: ${task.es.toFixed(0)}, EF: ${task.ef.toFixed(0)}\nLS: ${task.ls.toFixed(0)}, LF: ${task.lf.toFixed(0)}\nFloat: ${task.float.toFixed(1)}d`,
        color: {
          background: colors.background,
          border: colors.border,
          highlight: colors.highlight,
        },
        font: {
          color: colors.text,
          size: 14,
        },
        borderWidth: isCritical ? 2 : 1,
        shape: 'box',
        margin: { top: 8, right: 12, bottom: 8, left: 12 },
      };
    });

    // Create edges
    const edges: VisEdge[] = tasks.flatMap((task) =>
      (task.predecessors || []).map((predId) => {
        const predTask = result.tasks[predId as string];
        const isCritical =
          criticalPathSet.has(predId) && criticalPathSet.has(task.id);

        return {
          from: predId,
          to: task.id,
          arrows: { to: { enabled: true, scaleFactor: 0.7 } },
          color: {
            color: isCritical ? '#1a1a1a' : '#d0d0d0',
            highlight: '#000',
            hover: '#666',
          },
          width: isCritical ? 2 : 1,
          dashes: !isCritical,
          label: task.duration.toFixed(1).toString(),
          font: {
            size: 12,
            color: isCritical ? '#1a1a1a' : '#999',
            background: 'rgba(255,255,255,0.9)',
          },
        };
      }),
    );

    return { nodes, edges };
  }, [result]);
}

/**
 * Vis-network configuration options.
 */
export const GRAPH_OPTIONS = {
  nodes: {
    shape: 'box' as const,
    font: { size: 14 },
    borderWidth: 1,
  },
  edges: {
    smooth: {
      enabled: true,
      type: 'cubicBezier' as const,
      forceDirection: 'horizontal' as const,
      roundness: 0.2,
    },
    arrows: {
      to: { enabled: true, scaleFactor: 0.7, type: 'arrow' as const },
    },
  },
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'LR' as const,
      sortMethod: 'directed' as const,
      nodeSpacing: 400,
      levelSeparation: 250,
    },
  },
  physics: {
    enabled: false,
  },
  interaction: {
    dragNodes: true,
    dragView: true,
    zoomView: true,
  },
} as const;
