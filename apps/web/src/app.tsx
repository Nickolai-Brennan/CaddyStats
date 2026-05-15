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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
