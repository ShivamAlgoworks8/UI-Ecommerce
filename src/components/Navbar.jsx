/**
 * Navbar Component
 * ────────────────
 * Sticky dark header with active page indicator.
 * Glassmorphism effect on scroll for modern feel.
 * Layout: Logo | Search bar | Nav links + Cart
 */

import { Link, useLocation } from "react-router-dom";

export default function Navbar({ cartCount }) {
    const { pathname } = useLocation();

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
                    <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                        Shopify
                    </span>
                </Link>

                {/* ── Search Bar (Desktop) ── */}
                <div className="hidden md:block flex-1 max-w-md lg:max-w-lg mx-6">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search for products, brands and more"
                            className="w-full px-4 py-2 pl-10 rounded-lg bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200"
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
                </div>

                {/* ── Mobile Icons ── */}
                <div className="flex md:hidden items-center gap-4">
                    <button className="text-white/60 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <Link to="/products" className={navLinkClass("/products")}>
                        Shop
                    </Link>
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
                </div>
            </div>
        </nav>
    );
}
