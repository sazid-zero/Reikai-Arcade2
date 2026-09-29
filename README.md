# LEVEL / UP — Gaming Storefront (Next.js)

A high-performance, dark-themed gaming storefront built with Next.js (App Router), React, Tailwind CSS, Lucide icons, and an interactive 3D DualSense controller model powered by Google `<model-viewer>`.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

## Available Scripts

- `npm run dev`: Starts the Next.js development server on port 3000.
- `npm run build`: Compiles and optimizes the production build.
- `npm run start`: Runs the built production server.
- `npm run lint`: Checks for linting errors.

## Project Structure

- `src/app/page.tsx`: Main interactive storefront page with catalog, bag preview, 3D orbit on scroll, category filters.
- `src/app/layout.tsx`: Root layout with font imports, metadata, and dark theme defaults.
- `src/app/globals.css`: Tailwind styling, cyber neon accents, typography, and custom animations.
- `src/components/providers.tsx`: Client providers (QueryClientProvider, TooltipProvider, Toaster).
- `src/components/ui/`: Reusable UI components (Card, Toast, Tooltip).
- `public/ps5.glb`: 3D model asset for the interactive controller.
