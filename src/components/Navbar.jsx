/**
 * Navbar Component — Redesigned (Urbanova 2026)
 * ──────────────────────────────────────────────
 * White background navbar with logo, nav links,
 * search bar, and action icons (wishlist, cart, user).
 * Matches the Urbanova mockup design.
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import productCategories from "../data/categories";

export default function Navbar({ cartCount, wishlistCount, searchQuery, onSearchChange }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearchChange = (event) => {
        onSearchChange(event.target.value);
        if (pathname !== "/products") {
            navigate("/products");
        }
    };

    // Helper — active link class (light theme)
    const navLinkClass = (path) => {
        const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return `relative text-sm font-medium transition-colors duration-200 pb-0.5 ${
            isActive
                ? "text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent after:rounded-full"
                : "text-text-secondary hover:text-primary"
        }`;
    };

    return (
        <nav className="w-full sticky top-0 z-50 bg-white navbar-shadow">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* ── Brand Logo ── */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <img src="/favicon.svg" alt="Urbanova Logo" className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
                        <span className="text-xl font-bold tracking-tight text-primary">
                            Urbanova
                        </span>
                    </Link>

                    {/* ── Navigation Links (Desktop) ── */}
                    <div className="hidden md:flex items-center gap-7 shrink-0">
                        <Link to="/" className={navLinkClass("/")}>Home</Link>
                        <Link to="/products" className={navLinkClass("/products")}>Products</Link>
                        <div className="relative group">
                            <button className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-1">
                                Categories
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {/* Dropdown */}
                            <div className="absolute top-full left-0 mt-2 w-44 py-1.5 bg-white rounded-xl shadow-xl border border-border-light opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-slide-in-down">
                                {productCategories.map((cat) => (
                                    <Link
                                        key={cat}
                                        to="/products"
                                        onClick={() => onSearchChange(cat)}
                                        className="block px-4 py-2 text-sm text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link to="/products" className={navLinkClass("/deals")}>Deals</Link>
                    </div>

                    {/* ── Search Bar (Desktop) ── */}
                    <div className="hidden md:block flex-1 max-w-sm lg:max-w-md">
                        <div className="relative w-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search for products, brands and more..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                aria-label="Search products"
                                className="w-full px-4 py-2.5 pl-10 rounded-lg bg-surface-soft border border-border text-sm text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* ── Action Icons (Desktop) ── */}
                    <div className="hidden md:flex items-center gap-5 shrink-0">
                        {/* Wishlist */}
                        <Link to="/wishlist" className={`relative flex flex-col items-center group`} aria-label="Wishlist">
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary group-hover:text-accent transition-colors duration-200" fill={wishlistCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full animate-scale-in">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative flex flex-col items-center group" aria-label="Cart">
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary group-hover:text-accent transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] font-bold min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full animate-scale-in px-0.5">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* User */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    id="user-menu-button"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 group"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold ring-2 ring-accent/20">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-52 py-2 bg-white rounded-xl shadow-xl z-20 border border-border-light animate-scale-in origin-top-right">
                                            <div className="px-4 py-2.5 border-b border-border-light">
                                                <p className="text-xs text-text-muted">Signed in as</p>
                                                <p className="text-sm font-semibold text-primary truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => { logout(); setIsUserMenuOpen(false); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 mt-1"
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
                                className="flex flex-col items-center group"
                                aria-label="Login"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary group-hover:text-accent transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                        )}
                    </div>

                    {/* ── Mobile: icons + hamburger ── */}
                    <div className="flex md:hidden items-center gap-4">
                        <Link to="/wishlist" className="relative" aria-label="Wishlist">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill={wishlistCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{wishlistCount}</span>}
                        </Link>
                        <Link to="/cart" className="relative" aria-label="Cart">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 00-4-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-text-secondary hover:text-primary transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Search ── */}
                <div className="md:hidden pb-3">
                    <div className="relative w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            aria-label="Search products"
                            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-surface-soft border border-border text-sm text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                        />
                    </div>
                </div>
            </div>

            {/* ── Mobile Menu Dropdown ── */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border-light bg-white animate-slide-in-down">
                    <div className="px-4 py-3 space-y-1">
                        {[
                            { to: "/", label: "Home" },
                            { to: "/products", label: "Products" },
                            { to: "/products", label: "New Arrivals" },
                            { to: "/products", label: "Deals" },
                        ].map(link => (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-soft rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-border-light mt-2">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-2.5 text-sm font-medium text-accent hover:bg-accent-light rounded-lg transition-colors"
                                >
                                    Login / Sign Up
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}