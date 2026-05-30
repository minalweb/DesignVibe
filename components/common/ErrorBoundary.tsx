'use client';

import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[v0] Error boundary caught error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected error occurred';
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-50">
          <div className="max-w-md p-8 rounded-lg bg-neutral-900 border border-red-900">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500" size={24} />
              <h1 className="text-lg font-semibold">Something went wrong</h1>
            </div>
            <p className="text-sm text-neutral-400 mb-4">
              {isDev ? errorMessage : 'The application encountered an error. Please try again.'}
            </p>
            {isDev && this.state.error?.stack && (
              <pre className="text-xs text-neutral-500 bg-neutral-800 p-2 rounded mb-4 overflow-auto max-h-32">
                {this.state.error.stack}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
