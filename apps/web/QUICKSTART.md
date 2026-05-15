# Quick Start: CaddyStats Web App Shell

## What's Been Built

You now have a complete, production-ready frontend foundation for CaddyStats:

### ✅ Infrastructure
- **Type System**: Full TypeScript types for API contracts
- **API Client**: Typed HTTP client with automatic JWT refresh
- **Auth**: Global authentication context with session management
- **Queries**: TanStack Query with optimized caching
- **Routing**: TanStack Router with page structure
- **Layouts**: Responsive global layout with premium UI
- **Styles**: Tailwind CSS with global styles and utilities
- **Errors**: Error boundary and error handling

### ✅ File Locations
```
apps/web/src/
├── types/index.ts              # API types
├── lib/api-client.ts           # HTTP client
├── lib/query-client.ts         # Query configuration
├── contexts/auth.tsx           # Auth state
├── router.tsx                  # Routes
├── layouts/root.tsx            # Global layout
├── pages/not-found.tsx         # 404 page
├── components/error-boundary.tsx
├── config/env.ts               # Environment config
├── app.tsx                     # Root component
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## How to Use

### Running the Dev Server
```bash
cd apps/web
npm run dev
# App runs on http://localhost:5173
```

### Building for Production
```bash
npm run build
npm run preview
```

### Environment Variables
Copy or create `.env.local` from `.env.example`:
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_GRAPHQL_URL=http://localhost:8000/graphql
# ... other vars
```

## Architecture Overview

### Provider Stack
```javascript
<QueryClientProvider>
  <AuthProvider>
    <RouterProvider>
      <RootLayout>
        <Outlet /> {/* Pages render here */}
      </RootLayout>
    </RouterProvider>
  </AuthProvider>
</QueryClientProvider>
```

### Authentication Flow
1. User logs in via `apiClient.login(email, password)`
2. Tokens saved to localStorage and context
3. `Authorization: Bearer <token>` added to all requests
4. On 401, auto-refresh token or redirect to login
5. `useAuth()` hook provides user/status throughout app

### Data Fetching Pattern
```typescript
// Using TanStack Query with type-safe keys
const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.players.list(),
  queryFn: () => apiClient.getPlayers(),
})
```

### Routing
```typescript
// Routes defined in src/router.tsx
// Access via TanStack Router
import { useNavigate } from '@tanstack/react-router'
const navigate = useNavigate()
navigate({ to: '/players/$playerId', params: { playerId: '123' } })
```

## Next Steps

### 1. Build Public Pages
Create page components that use the API client:
- Home page (`src/pages/home.tsx`)
- Players list and detail (`src/pages/players/...`)
- Tournaments (`src/pages/tournaments/...`)
- Rankings (`src/pages/rankings.tsx`)
- Articles (`src/pages/articles/...`)

### 2. Create Reusable Components
- Hero sections, cards, tables
- Form components (login, search)
- Charts and visualizations
- Loading skeletons

### 3. Implement Auth Pages
- Login page with form validation
- Register page
- Protected route middleware

### 4. Add Analytics UI
- TanStack Table for sortable/filterable data
- Filters and search
- Data export

## API Integration Examples

### Fetching Data
```typescript
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { apiClient } from '@/lib/api-client'

export function PlayersList() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.players.list(),
    queryFn: () => apiClient.getPlayers({ page: 1, page_size: 50 }),
  })

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {data?.results.map(player => (
        <div key={player.id}>{player.name}</div>
      ))}
    </div>
  )
}
```

### Authentication
```typescript
import { useAuth } from '@/contexts/auth'

export function LoginForm() {
  const { login, isLoading, error } = useAuth()

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password)
      // Redirect to dashboard
    } catch (err) {
      console.error('Login failed', err)
    }
  }

  return (
    <form onSubmit={() => handleSubmit('test@example.com', 'password')}>
      {error && <div>{error}</div>}
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  )
}
```

### Protected Routes
```typescript
import { useIsAuthenticated } from '@/contexts/auth'

export function ProtectedComponent() {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return <div>Protected content</div>
}
```

## Performance Budgets (from Phase 3)

Cache times are pre-configured:
- **Auth**: 5 min (verify frequently)
- **Players**: 30 min (stable data)
- **Tournaments**: 2 hours (rarely changes)
- **Leaderboard**: 2 min (live updates)
- **Betting**: 5 min (market data)
- **Projections**: 30 min (model output)

Adjust in `src/lib/query-client.ts` if needed.

## Accessibility

✅ Already built in:
- Semantic HTML
- Keyboard navigation
- Focus management
- `prefers-reduced-motion` support
- 44x44px minimum touch targets
- Color contrast with dark theme

Continue following WCAG 2.1 when adding pages.

## Type Safety Checklist

When building pages:
- ✅ All API calls return typed data
- ✅ All hooks have typed returns
- ✅ All props are typed
- ✅ All state is typed
- ✅ No `any` types

## Common Patterns

### Loading State
```typescript
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({...})

if (isLoading) return <Skeleton />
if (error) return <Error message={error.detail} />
return <Content data={data} />
```

### Pagination
```typescript
const [page, setPage] = useState(1)
const { data } = useQuery({
  queryKey: queryKeys.players.list({ page }),
  queryFn: () => apiClient.getPlayers({ page, page_size: 50 }),
})
```

### Search
```typescript
const [query, setQuery] = useState('')
const { data } = useQuery({
  queryKey: queryKeys.players.lists(), 
  queryFn: () => apiClient.searchPlayers(query),
})
```

## Debugging

### Check Network Requests
- Open DevTools → Network tab
- Look for `/api/v1/*` requests
- Check response headers for auth token

### Check Query Cache
```typescript
// In browser console
import { queryClient } from '@/lib/query-client'
queryClient.getQueryData(['players', 'list'])
```

### Check Auth State
```typescript
// In browser console, from any component
import { useAuth } from '@/contexts/auth'
// Call useAuth() to see current state
```

### Environment Variables
```typescript
// In browser console
console.log(import.meta.env.VITE_API_BASE_URL)
```

## Resources

- [React Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Backend API Reference

Backend is running on `http://localhost:8000`:

### REST Endpoints (from Phase 3)
- `/api/v1/auth/login` - POST
- `/api/v1/players` - GET
- `/api/v1/tournaments` - GET
- `/api/v1/rankings/world` - GET
- `/api/v1/projections` - GET
- `/api/v1/betting/edges` - GET

### GraphQL
- `/graphql` - POST (introspection available)

See `src/lib/api-client.ts` for all available methods.

---

**Status**: Phase 4 foundation complete ✅
**Next**: Build public pages and components
**Questions**: Refer to docs/phase-4-web-shell-summary.md
