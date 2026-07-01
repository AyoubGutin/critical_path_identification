import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Field,
  HStack,
  Stack,
  Text,
  IconButton,
  Alert,
} from '@chakra-ui/react';
import { api } from '../api';
import { AnalysisResult } from '../types';
import { LuUpload, LuDownload, LuFileSpreadsheet, LuX } from 'react-icons/lu';

interface ExcelUploadProps {
  onAnalyse: (result: AnalysisResult) => void;
  onError: (error: string) => void;
}

export function ExcelUpload({ onAnalyse, onError }: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const showError = (message: string) => {
    setError(message);
    onError(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
      errorTimeoutRef.current = null;
    }, 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx')) {
        showError('Please upload a valid .xlsx file.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const response = await api.uploadExcel(file);
      onAnalyse(response);
    } catch (error: any) {
      console.error('Upload failed:', error);
      const message = error?.response?.data?.detail || error?.message || 'Upload failed. Please check your file format.';
      showError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await api.downloadTemplate();
    } catch (error: any) {
      console.error('Download failed:', error);
      const message = error?.response?.data?.detail || error?.message || 'Download failed. Please try again.';
      showError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <Stack gap="6">
      {/* Header */}
      <Box>
        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Excel Upload
        </Text>
      </Box>

      {/* Upload Section */}
      <Field.Root>
        <Field.Label>Upload Excel File (.xlsx)</Field.Label>
        <Box
          borderWidth="1px"
          borderColor="border"
          borderRadius="md"
          p="4"
          textAlign="center"
          position="relative"
          _hover={{ borderColor: 'border.hover' }}
          transition="border-color 0.2s"
        >
          {!file ? (
            <Stack gap="2" align="center">
              <LuFileSpreadsheet size="24" color="var(--colors-fg-muted)" />
              <Text fontSize="sm" color="fg.muted">Drag & drop or click to browse</Text>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </Stack>
          ) : (
            <HStack justify="space-between" p="2">
              <HStack gap="3">
                <LuFileSpreadsheet size="18" />
                <Text>{file.name}</Text>
                <Text fontSize="sm" color="fg.muted">
                  {(file.size / 1024).toFixed(0)} KB
                </Text>
              </HStack>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={handleClearFile}
              >
                <LuX />
              </IconButton>
            </HStack>
          )}
        </Box>
      </Field.Root>

      {/* Actions */}
      <HStack justify="space-between">
        <HStack gap="4">
          <Button
            bg="fg"
            color="bg"
            onClick={handleUpload}
            disabled={!file}
            loading={isUploading}
            loadingText="Analysing..."
            _hover={{ bg: 'fg.muted' }}
          >
            <LuUpload /> Analyse
          </Button>
          {file && (
            <Button variant="ghost" size="sm" onClick={handleClearFile}>
              Clear
            </Button>
          )}
        </HStack>
        <Button
          bg="fg"
          color="bg"
          size="sm"
          onClick={handleDownloadTemplate}
          loading={isDownloading}
          loadingText="Downloading..."
          _hover={{ bg: 'fg.muted' }}
        >
          <LuDownload /> Download Template
        </Button>
      </HStack>

      {error && (
        <Alert status="error" variant="subtle">
          {error}
        </Alert>
      )}
    </Stack>
  );
}
