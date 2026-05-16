import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Auth Context Provider
 *
 * Global authentication state management including user, tokens, and permissions.
 * Handles session initialization, token refresh, and logout flows.
 */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
const AuthContext = createContext(undefined);
/**
 * Auth Context Provider component
 */
export function AuthProvider({ children }) {
    const [session, setSession] = useState({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });
    /**
     * Initialize auth session on mount
     */
    const initializeSession = useCallback(async () => {
        try {
            setSession((prev) => ({ ...prev, isLoading: true, error: null }));
            // Try to get current user if token exists
            const token = apiClient.getAuthToken();
            if (token) {
                const user = await apiClient.getCurrentUser();
                setSession({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            }
            else {
                setSession({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to initialize session';
            setSession({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });
        }
    }, []);
    /**
     * Initialize session on mount
     */
    useEffect(() => {
        initializeSession();
    }, [initializeSession]);
    /**
     * Handle login
     */
    const login = useCallback(async (email, password) => {
        try {
            setSession((prev) => ({ ...prev, isLoading: true, error: null }));
            const response = await apiClient.login({ email, password });
            setSession({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setSession((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            throw error;
        }
    }, []);
    /**
     * Handle registration
     */
    const register = useCallback(async (email, password, name) => {
        try {
            setSession((prev) => ({ ...prev, isLoading: true, error: null }));
            const response = await apiClient.register({ email, password, name });
            setSession({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setSession((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            throw error;
        }
    }, []);
    /**
     * Handle logout
     */
    const logout = useCallback(async () => {
        try {
            setSession((prev) => ({ ...prev, isLoading: true }));
            await apiClient.logout();
            setSession({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Logout failed';
            setSession({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    }, []);
    /**
     * Refresh session and check auth status
     */
    const refreshSession = useCallback(async () => {
        try {
            const token = apiClient.getAuthToken();
            if (token) {
                const user = await apiClient.getCurrentUser();
                setSession({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            }
            else {
                setSession({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Session refresh failed';
            setSession({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });
        }
    }, []);
    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setSession((prev) => ({ ...prev, error: null }));
    }, []);
    const value = {
        user: session.user,
        isAuthenticated: session.isAuthenticated,
        isLoading: session.isLoading,
        error: session.error,
        login,
        register,
        logout,
        refreshSession,
        clearError,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
/**
 * Hook to use auth context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission) {
    const { user } = useAuth();
    return user?.permissions?.includes(permission) ?? false;
}
/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role) {
    const { user } = useAuth();
    return user?.role === role;
}
/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated;
}
