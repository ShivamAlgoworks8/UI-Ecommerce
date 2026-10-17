/**
 * ScrollToTop Component
 * ─────────────────────
 * Automatically scrolls to the top of the page whenever
 * the route changes. This prevents the page from staying
 * at the bottom when navigating between pages.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
