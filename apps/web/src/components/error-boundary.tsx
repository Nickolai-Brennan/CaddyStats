/**
 * Error Boundary Component
 *
 * React Error Boundary for catching and displaying errors gracefully.
 */

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console and error tracking service
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Report to error tracking service (Sentry, etc.)
    // reportToErrorTracking(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
          <div className="max-w-md space-y-4 rounded-lg border border-red-900 bg-red-950/20 p-6 backdrop-blur-sm">
            <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
            <p className="text-slate-300">
              We encountered an unexpected error. Our team has been notified.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="space-y-2 rounded bg-slate-900/50 p-4 font-mono text-sm">
                <p className="font-semibold text-red-400">Error Details:</p>
                <p className="text-slate-300">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <details className="text-slate-400">
                    <summary>Component Stack</summary>
                    <pre className="overflow-auto text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <button
              onClick={this.resetError}
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Try Again
            </button>

            <a
              href="/"
              className="block text-center text-amber-400 hover:text-amber-300 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
