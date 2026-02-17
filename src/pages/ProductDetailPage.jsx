/**
 * ProductDetailPage
 * ──────────────────
 * Single product view — full-width section wrappers with
 * inner max-width for content readability. Consistent with
 * the rest of the site's container strategy.
 */

import { useParams, Link } from "react-router-dom";
import products from "../data/products";

export default function ProductDetailPage({ onAddToCart }) {
    const { id } = useParams();
    const product = products.find((p) => p.id === Number(id));

    if (!product) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-6">
                <div className="text-center animate-fade-in-up max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-surface-soft flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2">Product Not Found</h2>
                    <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                        The product you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300"
                    >
                        ← Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* ── Breadcrumb ── */}
            <div className="w-full bg-surface-soft border-b border-border-light py-3 px-6">
                <div className="max-w-6xl mx-auto">
                    <nav className="flex items-center gap-2 text-sm text-text-muted">
                        <Link to="/" className="hover:text-accent transition-colors duration-200">Home</Link>
                        <span className="text-text-muted/40">/</span>
                        <Link to="/products" className="hover:text-accent transition-colors duration-200">Products</Link>
                        <span className="text-text-muted/40">/</span>
                        <span className="text-primary font-medium truncate max-w-[200px]">{product.title}</span>
                    </nav>
                </div>
            </div>

            {/* ── Product Detail Grid ── */}
            <section className="w-full bg-white py-8 lg:py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-14">

                        {/* ── Product Image ── */}
                        <div className="animate-fade-in-up">
                            <div className="rounded-2xl overflow-hidden bg-surface-soft border border-border-light">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-[320px] sm:h-[400px] lg:h-[500px] object-cover"
                                />
                            </div>
                        </div>

                        {/* ── Product Info ── */}
                        <div className="flex flex-col justify-center animate-slide-in-right delay-200">
                            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3 px-3 py-1 bg-accent/10 rounded-full w-fit">
                                {product.category}
                            </span>

                            <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight mb-3">
                                {product.title}
                            </h1>

                            <div className="flex items-baseline gap-3 mb-5">
                                <p className="text-3xl font-bold text-primary">
                                    ${product.price.toFixed(2)}
                                </p>
                                <span className="text-sm text-green-600 font-medium">In Stock</span>
                            </div>

                            <div className="w-full h-px bg-border-light mb-5" />

                            <p className="text-text-secondary leading-relaxed mb-6 text-sm lg:text-base">
                                {product.description}
                            </p>

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                {["Premium Quality Materials", "Free Shipping Over $100", "30-Day Easy Returns"].map(
                                    (feature) => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-sm text-text-secondary">{feature}</span>
                                        </div>
                                    )
                                )}
                            </div>

                            <button
                                onClick={() => onAddToCart(product)}
                                className="w-full sm:w-auto px-10 py-3.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] cursor-pointer"
                            >
                                Add to Cart — ${product.price.toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Related Products ── */}
            <section className="w-full bg-surface-soft border-t border-border-light py-10 lg:py-14 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-end justify-between mb-6">
                        <h3 className="text-lg font-bold text-primary">You Might Also Like</h3>
                        <Link
                            to="/products"
                            className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-200 flex items-center gap-1"
                        >
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {products
                            .filter((p) => p.id !== product.id)
                            .slice(0, 4)
                            .map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    to={`/product/${relatedProduct.id}`}
                                    className="group rounded-xl overflow-hidden bg-white border border-border-light hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="text-sm font-medium text-primary truncate group-hover:text-accent transition-colors duration-200">{relatedProduct.title}</h4>
                                        <p className="text-sm font-bold text-primary mt-1">${relatedProduct.price.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
