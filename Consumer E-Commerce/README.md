# 🛍️ Urbanova Store — Modern E-Commerce Frontend

A clean, minimal e-commerce frontend built with **React** and **Tailwind CSS**, inspired by modern Dribbble design aesthetics.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

---

## ✨ Features

- **Homepage** — Full-width hero section with CTA, featured products grid, promotional banner, and trust badges
- **Products Page** — Responsive 4-column grid of product cards with category tags and hover effects
- **Product Detail Page** — Large image + info layout with breadcrumbs, feature badges, and related products
- **Shopping Cart** — Quantity controls, order summary with shipping logic, and empty-state design
- **Cart Management** — useState-based add/remove/update with live item count badge
- **Responsive Design** — Mobile-first layout that scales beautifully to desktop
- **Smooth Animations** — Fade-in, slide-in, and scale animations with staggered delays

---

## 🗂️ Project Structure

```
Urbanova/
├── index.html                    # App entry HTML with SEO meta tags
├── vite.config.js                # Vite + Tailwind CSS v4 plugin config
├── package.json                  # Dependencies and scripts
├── public/
│   └── vite.svg                  # Favicon
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Root component (Router + Cart state)
    ├── index.css                 # Tailwind CSS + custom design tokens
    ├── data/
    │   └── products.js           # Static product data array (8 items)
    ├── components/
    │   ├── Navbar.jsx            # Sticky nav with cart badge
    │   ├── Footer.jsx            # Footer with newsletter form
    │   ├── ProductCard.jsx       # Reusable product card
    │   └── ScrollToTop.jsx       # Scroll-to-top on route change
    └── pages/
        ├── HomePage.jsx          # Hero + featured products + promo
        ├── ProductsPage.jsx      # Full product listing grid
        ├── ProductDetailPage.jsx # Single product detail view
        └── CartPage.jsx          # Cart with summary sidebar
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# 1. Navigate to the project directory
cd Urbanova

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/**

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 🎨 Design System

| Token              | Value              | Usage                    |
|---------------------|--------------------|--------------------------|
| `--color-primary`   | `#1a1a2e`          | Headings, buttons, nav   |
| `--color-accent`    | `#e94560`          | CTAs, badges, highlights |
| `--color-surface`   | `#ffffff`          | Page backgrounds         |
| `--color-surface-soft` | `#f8f9fa`       | Card backgrounds         |
| `--color-text-secondary` | `#6b7280`    | Body text                |
| `--color-border`    | `#e5e7eb`          | Borders, dividers        |
| Font                | Inter              | All typography           |

---

## 🛠️ Tech Stack

- **React 19** — Functional components with hooks (useState only)
- **Tailwind CSS v4** — Utility-first styling via Vite plugin
- **React Router v7** — Client-side routing
- **Vite 7** — Lightning-fast dev server and bundler

---

## 📦 Data

Products are stored as a static array in `src/data/products.js` with 8 curated items. Each product has:
- `id`, `title`, `price`, `category`, `image`, `description`

Images are sourced from [Unsplash](https://unsplash.com) for high-quality product photography.

---

## 📝 License

This project is for educational/demonstration purposes.
