import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Error Boundary Component
 *
 * React Error Boundary for catching and displaying errors gracefully.
 */
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }
    componentDidCatch(error, errorInfo) {
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
            return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-slate-950 text-slate-50", children: _jsxs("div", { className: "max-w-md space-y-4 rounded-lg border border-red-900 bg-red-950/20 p-6 backdrop-blur-sm", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Oops! Something went wrong" }), _jsx("p", { className: "text-slate-300", children: "We encountered an unexpected error. Our team has been notified." }), process.env.NODE_ENV === 'development' && this.state.error && (_jsxs("div", { className: "space-y-2 rounded bg-slate-900/50 p-4 font-mono text-sm", children: [_jsx("p", { className: "font-semibold text-red-400", children: "Error Details:" }), _jsx("p", { className: "text-slate-300", children: this.state.error.toString() }), this.state.errorInfo && (_jsxs("details", { className: "text-slate-400", children: [_jsx("summary", { children: "Component Stack" }), _jsx("pre", { className: "overflow-auto text-xs", children: this.state.errorInfo.componentStack })] }))] })), _jsx("button", { onClick: this.resetError, className: "inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-950 hover:bg-amber-400 transition-colors", children: "Try Again" }), _jsx("a", { href: "/", className: "block text-center text-amber-400 hover:text-amber-300 transition-colors", children: "Back to Home" })] }) }));
        }
        return this.props.children;
    }
}
