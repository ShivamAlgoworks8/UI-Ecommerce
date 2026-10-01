# Nexora E-Commerce

React 19, TypeScript, and Vite admin dashboard styled with Tailwind CSS 4 and shadcn/ui components.

## Development

```sh
npm install
npm run dev
```

The Vite development server uses port `3001` by default.

## Verification

```sh
npm run lint
npm run build
```

## Source structure

- `src/app` contains the application shell and app-wide types.
- `src/components/admin`, `src/components/common`, and `src/components/ui` contain reusable interface components.
- `src/features` groups screens and their related types by feature; each screen lives in its feature's `pages` folder.
- `src/assets` contains imported static assets, `src/lib` contains shared utilities, and `src/styles` contains global styles.

Reusable shadcn/ui components are maintained in `src/components/ui`. The project uses the `@/` alias and configures Tailwind through its Vite plugin.
