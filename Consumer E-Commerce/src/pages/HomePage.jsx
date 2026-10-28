/**
 * HomePage — Redesigned (Urbanova 2026)
 * ───────────────────────────────────────
 * 1. Hero — split layout with left text + right full-bleed image + carousel dots
 * 2. Featured Products — dynamically fetched from MongoDB backend
 * 3. Promo Banner — bold CTA section
 * 4. Trust Badges — 4-column icon strip
 */

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API_BASE_URL = "http://localhost:8080";

const heroSlides = [
    {
        label: "New Season",
        heading: "Everyday",
        headingAccent: "Essentials",
        subtext: "Premium bags, watches, electronics and more designed for your modern lifestyle.",
        ctaText: "Shop Now",
        ctaLink: "/products",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&h=600&fit=crop",
        imageAlt: "Collection of everyday essentials",
    },
    {
        label: "New Arrivals",
        heading: "Premium",
        headingAccent: "Collection",
        subtext: "Curated accessories and electronics crafted for the modern lifestyle.",
        ctaText: "Explore Now",
        ctaLink: "/products",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=600&fit=crop",
        imageAlt: "Premium watch collection",
    },
    {
        label: "Exclusive Deals",
        heading: "Up to 40%",
        headingAccent: "Off Today",
        subtext: "Grab the best deals on top-rated products before they sell out.",
        ctaText: "View Deals",
        ctaLink: "/products",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=600&fit=crop",
        imageAlt: "Deal on premium headphones",
    },
];

const trustBadges = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        title: "Free Shipping",
        desc: "On orders above ₹999",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        title: "Easy Returns",
        desc: "Hassle-free returns",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
        title: "Secure Payment",
        desc: "100% safe & secure",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        title: "24/7 Support",
        desc: "We're here to help",
    },
];

export default function HomePage({ onAddToCart, wishlist = [], onToggleWishlist }) {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const currentSlide = heroSlides[activeSlide];

    useEffect(() => {
        let isMounted = true;

        async function fetchFeatured() {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/products`);
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) {
                        const mapped = data.map((product) => ({
                            id: product.id,
                            merchantName: product.merchantName || "",
                            title: product.name,
                            price: Number(product.price),
                            category: product.productType || "Other",
                            description: product.description || "",
                            image: product.imageUrl || "",
                            inStock: Number(product.stock) > 0,
                            stock: Number(product.stock),
                            rating: 0,
                            reviewCount: 0,
                            colors: [],
                        }));
                        setFeaturedProducts(mapped.slice(0, 4));
                    }
                }
            } catch (err) {
                console.error("Failed to load featured products:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchFeatured();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            {/* ═══════════════════════════════════════════
          HERO — Split Layout with Slider
          ═══════════════════════════════════════════ */}
            <section className="w-full relative overflow-hidden bg-surface-soft border-b border-border-light">
                <div className="grid lg:grid-cols-2 items-stretch min-h-[360px] lg:min-h-[440px]">

                    {/* ── Left: Text Content ── */}
                    <div className="flex flex-col justify-center px-8 py-14 lg:py-16 lg:px-14 xl:px-20 animate-fade-in-up">
                        {/* Label */}
                        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">
                            {currentSlide.label}
                        </span>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-primary mb-4">
                            {currentSlide.heading}
                            <br />
                            <span className="text-primary">{currentSlide.headingAccent}</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-sm lg:text-base text-text-secondary max-w-sm mb-8 leading-relaxed">
                            {currentSlide.subtext}
                        </p>

                        {/* CTA Button */}
                        <div>
                            <Link
                                id="hero-shop-now-btn"
                                to={currentSlide.ctaLink}
                                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98]"
                            >
                                {currentSlide.ctaText}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        {/* Slider Dots */}
                        <div className="flex items-center gap-2 mt-10">
                            {heroSlides.map((_, i) => (
                                <button
                                    key={i}
                                    id={`hero-dot-${i}`}
                                    onClick={() => setActiveSlide(i)}
                                    className={`slider-dot ${i === activeSlide ? "active" : ""}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Hero Image ── */}
                    <div className="relative overflow-hidden">
                        <img
                            src={currentSlide.image}
                            alt={currentSlide.imageAlt}
                            className="w-full h-full object-cover min-h-[260px] lg:min-h-0 transition-opacity duration-500"
                            style={{ aspectRatio: "auto" }}
                        />
                        {/* Subtle left gradient overlay */}
                        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-soft to-transparent hidden lg:block" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS
          ═══════════════════════════════════════════ */}
            <section className="w-full bg-white py-14 lg:py-18 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1 block">
                                Handpicked for you
                            </span>
                            <h2 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
                                Featured Products
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            id="featured-view-all-link"
                            className="mt-3 sm:mt-0 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-200 flex items-center gap-1"
                        >
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="py-12 text-center text-text-muted">Loading products from backend...</div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="py-12 text-center text-text-muted">No products available in the backend.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                            {featuredProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                    wishlist={wishlist}
                                    onToggleWishlist={onToggleWishlist}
                                    animationDelay={`delay-${(index + 1) * 100}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          PROMO BANNER
          ═══════════════════════════════════════════ */}
            <section className="w-full bg-primary py-16 lg:py-20 text-center px-6 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

                <div className="relative">
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4 px-3 py-1 bg-accent/10 rounded-full">
                        Special Offer
                    </span>
                    <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                        Upgrade Your Everyday
                    </h2>
                    <p className="text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed text-sm lg:text-base">
                        Free shipping on orders over ₹999. Hassle-free returns within 30 days.
                        Quality craftsmanship guaranteed.
                    </p>
                    <Link
                        to="/products"
                        id="promo-shop-btn"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white text-sm font-bold rounded-lg hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 active:scale-[0.98]"
                    >
                        Start Shopping
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          TRUST BADGES — 4 columns (matches mockup)
          ═══════════════════════════════════════════ */}
            <section className="w-full bg-white border-t border-border-light py-10 lg:py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {trustBadges.map((badge) => (
                            <div
                                key={badge.title}
                                className="flex flex-col items-center text-center gap-3 py-4"
                            >
                                <div className="trust-badge-icon">
                                    {badge.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-primary">{badge.title}</h4>
                                    <p className="text-xs text-text-muted mt-0.5">{badge.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
