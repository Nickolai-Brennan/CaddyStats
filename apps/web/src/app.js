import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Root App Component
 *
 * Orchestrates all providers: QueryClientProvider, AuthProvider, RouterProvider.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '@/lib/query-client';
import { router } from '@/router';
import { AuthProvider } from '@/contexts/auth';
export function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsx(RouterProvider, { router: router }) }) }));
}
