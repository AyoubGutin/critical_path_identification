import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Text,
  Separator,
} from '@chakra-ui/react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ManualEntry } from './pages/ManualEntry';
import { ExcelUpload } from './pages/ExcelUpload';
import { Results } from './pages/Results';
import { AnalysisResult } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layout component with header
function Layout() {
  const location = useLocation();
  const isResultsPage = location.pathname === '/results';

  return (
    <Box minH="100vh" bg="bg.subtle">
      {/* Full-width header */}
      <Box py="6" px="8">
        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
          Critical Path Analysis
        </Text>
        <Box mt="4">
          <Separator />
        </Box>
      </Box>

      <Container maxW="8xl" py="8">
        {!isResultsPage && (
          <Box mb="6" display="flex" gap="4">
            <Link
              to="/manual"
              style={{
                textDecoration: 'none',
                fontSize: '0.875rem',
                color: location.pathname === '/manual' ? 'var(--chakra-colors-fg)' : 'var(--chakra-colors-fg-muted)',
                fontWeight: location.pathname === '/manual' ? '500' : '400',
              }}
            >
              Manual Entry
            </Link>
            <Link
              to="/excel"
              style={{
                textDecoration: 'none',
                fontSize: '0.875rem',
                color: location.pathname === '/excel' ? 'var(--chakra-colors-fg)' : 'var(--chakra-colors-fg-muted)',
                fontWeight: location.pathname === '/excel' ? '500' : '400',
              }}
            >
              Excel Upload
            </Link>
          </Box>
        )}
        <Outlet />
      </Container>
    </Box>
  );
}

// Wrapper to handle results state
function AppWrapper() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleShowResults = (analysisResult: AnalysisResult) => {
    setResult(analysisResult);
    setError(null);
    navigate('/results');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/manual" replace />} />
        <Route path="manual" element={<ManualEntry onAnalyse={handleShowResults} onError={handleError} />} />
        <Route path="excel" element={<ExcelUpload onAnalyse={handleShowResults} onError={handleError} />} />
        <Route path="results" element={<Results result={result} />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
