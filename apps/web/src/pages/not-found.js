import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 404 Not Found Page
 */
import { Link } from '@tanstack/react-router';
export function NotFound() {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-slate-950 text-slate-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-6xl font-bold mb-4", children: "404" }), _jsx("p", { className: "text-2xl font-semibold mb-2", children: "Page Not Found" }), _jsx("p", { className: "text-slate-400 mb-6", children: "The page you're looking for doesn't exist or has been moved." }), _jsx(Link, { to: "/", className: "inline-block rounded-lg bg-amber-500 px-6 py-2 font-medium text-slate-950 hover:bg-amber-400 transition-colors", children: "Back to Home" })] }) }));
}
