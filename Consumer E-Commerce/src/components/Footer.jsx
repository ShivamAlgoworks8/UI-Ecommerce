/**
 * Footer Component — Redesigned (Urbanova 2026)
 * ───────────────────────────────────────────────
 * Trust badges strip + 4-column footer with social links,
 * quick links, support links, brand description, and
 * payment method logos. Matches Urbanova mockup.
 */

import { Link } from "react-router-dom";

const footerLinks = {
    shop: [
        { label: "All Products", to: "/products" },
        { label: "New Arrivals", to: "/products" },
        { label: "Best Sellers", to: "/products" },
        { label: "Offers", to: "/products" },
        { label: "Gift Cards", to: "/products" },
    ],
    support: [
        { label: "Help Center", href: "#" },
        { label: "Track Order", href: "#" },
        { label: "Returns & Refunds", href: "#" },
        { label: "Shipping Info", href: "#" },
        { label: "Contact Us", href: "#" },
    ],
    company: [
        { label: "About Us", href: "#" },
        { label: "Our Story", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Terms & Conditions", href: "#" },
        { label: "Privacy Policy", href: "#" },
    ],
};

const socialLinks = [
    {
        name: "Instagram",
        href: "#",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z" />
            </svg>
        ),
    },
    {
        name: "Facebook",
        href: "#",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
        ),
    },
    {
        name: "YouTube",
        href: "#",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        name: "Twitter",
        href: "#",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
        ),
    },
];

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-border-light">

            {/* ── Main Footer Grid ── */}
            <div className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                    {/* ── Brand Column ── */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src="/favicon.svg" alt="Urbanova Logo" className="w-8 h-8" />
                            <span className="text-lg font-bold tracking-tight text-primary">Urbanova</span>
                        </Link>
                        <p className="text-sm text-text-secondary leading-relaxed mb-5 max-w-xs">
                            Your one-stop destination for premium bags, watches, electronics and everyday essentials.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    aria-label={social.name}
                                    className="w-8 h-8 rounded-lg bg-surface-soft border border-border-light flex items-center justify-center text-text-secondary hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Shop Links ── */}
                    <div>
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">Shop</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.shop.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Support Links ── */}
                    <div>
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">Support</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Company Links ── */}
                    <div>
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className="border-t border-border-light">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} Urbanova. All rights reserved.
                    </p>

                    {/* Payment Method Logos */}
                    <div className="flex items-center gap-3">
                        {/* Visa */}
                        <div className="h-6 px-2 rounded bg-surface-muted border border-border-light flex items-center justify-center">
                            <span className="text-[10px] font-bold text-blue-700 tracking-wider">VISA</span>
                        </div>
                        {/* Mastercard */}
                        <div className="h-6 px-2 rounded bg-surface-muted border border-border-light flex items-center gap-0.5 justify-center">
                            <span className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90 inline-block" />
                            <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 opacity-90 -ml-1.5 inline-block" />
                        </div>
                        {/* PayPal */}
                        <div className="h-6 px-2 rounded bg-surface-muted border border-border-light flex items-center justify-center">
                            <span className="text-[10px] font-bold text-blue-600">PayPal</span>
                        </div>
                        {/* UPI */}
                        <div className="h-6 px-2 rounded bg-surface-muted border border-border-light flex items-center justify-center">
                            <span className="text-[10px] font-bold text-purple-600">UPI</span>
                        </div>
                        {/* RuPay */}
                        <div className="h-6 px-2 rounded bg-surface-muted border border-border-light flex items-center justify-center">
                            <span className="text-[10px] font-bold text-green-600">RuPay</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
