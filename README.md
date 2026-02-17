# 🛍️ Shopify Store — Modern E-Commerce Frontend

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
- **Cart Management** — Add, remove, and update cart items with live item count
- **Responsive Design** — Mobile-first layout that scales beautifully to desktop
- **Smooth Animations** — Fade-in, slide-in, and scale animations with staggered delays

---

## 🗂️ Project Structure

```text
Task-1/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   └── products.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── ProductCard.jsx
    │   └── ScrollToTop.jsx
    └── pages/
        ├── HomePage.jsx
        ├── ProductsPage.jsx
        ├── ProductDetailPage.jsx
        └── CartPage.jsx


---

🚀 Getting Started

Prerequisites

Node.js 18+

npm


Installation

git clone <repository-url>
cd Task-1
npm install
npm run dev

The app will be available at:

http://localhost:5173/

Build for Production

npm run build

The production build will be generated in the dist/ folder.


---

🎨 Design System

Token	Value	Usage

--color-primary	#1a1a2e	Headings, buttons, navigation
--color-accent	#e94560	CTAs, badges, highlights
--color-surface	#ffffff	Page backgrounds
--color-surface-soft	#f8f9fa	Card backgrounds
--color-text-secondary	#6b7280	Secondary text
--color-border	#e5e7eb	Borders and dividers
Font	Inter	All typography



---

🛠️ Tech Stack

React 19 — Functional components with hooks

Tailwind CSS v4 — Utility-first styling via Vite plugin

React Router v7 — Client-side routing

Vite 7 — Fast development server and bundler



---

📦 Product Data

Products are stored as a static array in:

src/data/products.js

Each product contains:

id

title

price

category

image

description


Product images are sourced from Unsplash for high-quality product photography.


---

🛒 Core Functionality

The application currently supports:

Product browsing

Product categories

Product details

Add to cart

Remove from cart

Increase/decrease product quantity

Cart item count

Cart total calculation

Responsive navigation

Client-side routing



---

📱 Responsive Design

The application is designed to work across:

Desktop

Laptop

Tablet

Mobile devices



---

📝 License

This project is for educational and demonstration purposes.