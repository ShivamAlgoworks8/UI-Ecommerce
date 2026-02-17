/**
 * Footer Component
 * ────────────────
 * Full-width footer with max-w-6xl inner container
 * for readable column widths. 4-column grid layout.
 */

import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-gray-900 text-white py-14 lg:py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">

                    {/* ── Brand Column ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight">Shopify</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-5">
                            Curated essentials for modern living. Premium products designed with quality craftsmanship.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { name: "facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                                { name: "twitter", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                                { name: "instagram", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z" },
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white transition-all duration-200"
                                    aria-label={social.name}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={social.icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Quick Links ── */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { to: "/", label: "Home" },
                                { to: "/products", label: "All Products" },
                                { to: "/cart", label: "My Cart" },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Customer Service ── */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">
                            Customer Service
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                "Contact Us",
                                "Shipping Policy",
                                "Return & Refund",
                                "FAQ",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Newsletter ── */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">
                            Newsletter
                        </h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Get updates on new arrivals and exclusive offers.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 min-w-0 px-4 py-2.5 rounded-l-md bg-white/10 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <button className="px-5 py-2.5 bg-accent hover:bg-accent-hover rounded-r-md text-sm font-medium transition-colors duration-200 shrink-0">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Divider & Copyright ── */}
                <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Shopify Store. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
                        <span className="text-xs text-gray-500 italic">~ Shivam Srivastav</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
