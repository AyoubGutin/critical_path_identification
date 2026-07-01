import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Container, Text, Button, Stack } from '@chakra-ui/react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error boundary caught:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box minH="100vh" bg="bg.subtle" display="flex" alignItems="center" justifyContent="center">
          <Container maxW="md" py="8">
            <Stack gap="6" textAlign="center">
              <Text fontSize="xl" fontWeight="500">
                Something went wrong
              </Text>
              <Text color="fg.muted">
                An unexpected error occurred. Please try again.
              </Text>
              <Button
                bg="fg"
                color="bg"
                onClick={this.handleReset}
                _hover={{ bg: 'fg.muted' }}
              >
                Try Again
              </Button>
            </Stack>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
