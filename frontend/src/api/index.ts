import { TaskInput, AnalysisResult } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  downloadTemplate: async (): Promise<void> => {
    const response = await fetch(`${API_BASE}/download-excel`);
    if (!response.ok) throw new Error('Failed to download template');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pert_project_template.xlsx';
    a.click();
  },

  uploadExcel: async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/upload-excel`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  analyseProject: async (tasks: TaskInput[]): Promise<AnalysisResult> => {
    const response = await fetch(`${API_BASE}/analyse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    });
    if (!response.ok) throw new Error('Analysis failed');
    return response.json();
  },
};
