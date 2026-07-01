export interface TaskInput {
  id: string;
  name: string;
  optimistic: number;
  most_likely: number;
  pessimistic: number;
  predecessors: string[];
}

export interface TaskResult {
  id: string;
  name: string;
  duration: number;
  predecessors: string;
  es: number;
  ef: number;
  ls: number;
  lf: number;
  float: number;
}

export interface AnalysisResult {
  status: string;
  total_duration: number;
  critical_path: string[];
  tasks: Record<string, TaskResult>;
}
