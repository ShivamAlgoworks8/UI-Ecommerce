import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar({ cartCount }) {
    const { pathname } = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Helper — returns active styles if path matches
    const navLinkClass = (path) => {
        const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return `text-sm font-medium transition-colors duration-200 ${isActive
            ? "text-white"
            : "text-white/60 hover:text-white"
            }`;
    };

    return (
        <nav className="w-full sticky top-0 z-50 bg-primary shadow-lg">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16">

                {/* ── Brand Logo ── */}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                    <img src="/favicon.svg" alt="Urbanova Logo" className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
                    <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                        Urbanova
                    </span>
                </Link>

                {/* ── Search Bar (Desktop) ── */}
                <div className="hidden md:block flex-1 max-w-md lg:max-w-lg mx-6">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full px-4 py-2 pl-10 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* ── Navigation Links (Desktop) ── */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                    <Link to="/" className={navLinkClass("/")}>
                        Home
                    </Link>
                    <Link to="/products" className={navLinkClass("/products")}>
                        Products
                    </Link>
                    <Link
                        to="/cart"
                        className={`relative flex items-center gap-1.5 ${navLinkClass("/cart")}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                            />
                        </svg>
                        Cart
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-4 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-scale-in border-2 border-primary">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Section */}
                    <div className="h-6 w-px bg-white/10 mx-1" />

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold text-xs uppercase">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-xl z-20 border border-gray-100 animate-scale-in origin-top-right">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-xs text-gray-400">Signed in as</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 border border-white/10"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* ── Mobile Icons ── */}
                <div className="flex md:hidden items-center gap-4">
                    <Link to="/cart" className={`relative ${navLinkClass("/cart")}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                            />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-primary">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold ring-2 ring-white/10" onClick={logout}>
                            {user.name.charAt(0)}
                        </div>
                    ) : (
                        <Link to="/login" className="text-white/60 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

