# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.3 application for managing clients (müşteriler), products (ürünler), and orders (satışlar) with a Turkish language interface. It uses App Router, TypeScript, Prisma ORM with SQLite, and implements JWT-based authentication.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma generate        # Generate Prisma Client after schema changes
npx prisma migrate dev     # Create and apply migrations
npx prisma studio          # Open Prisma Studio GUI
npx prisma db push         # Push schema changes without migrations
```

## Architecture

### Database & Prisma Configuration

- **Database**: SQLite (file-based at `prisma/dev.db`)
- **Prisma Client Location**: Generated to `src/generated/prisma/` (not the default `node_modules/.prisma`)
- **Database Singleton**: `src/lib/db.ts` exports a singleton Prisma client instance with hot-reload support in development
- **Schema**: Three models - `Client`, `Product`, and `Order` with relations

**Important**: After modifying `prisma/schema.prisma`, always run `npx prisma generate` to regenerate the client in `src/generated/prisma/`.

### Authentication Flow

- **Session Management**: JWT-based sessions stored in HTTP-only cookies (`src/lib/session.ts`)
- **Login**: Uses server action `loginAction` in `src/app/actions.ts` with timing-safe password comparison
- **Middleware Protection**: `src/middleware.ts` protects all `/panel/*` routes
- **Environment Variables Required**:
  - `LOGIN_PASSWORD`: Plain text password for admin login
  - `JWT_SECRET`: Secret key for JWT signing
  - `DATABASE_URL`: SQLite database path

The middleware validates JWT tokens on every request to `/panel` routes and redirects unauthenticated users to the login page (`/`).

### API Route Structure

API routes follow a modular pattern organized by entity and operation:

```
src/app/api/
├── clientOperations/
│   ├── createClient/route.ts    # POST & GET for clients
│   ├── updateClient/route.ts    # PUT for updating
│   └── deleteClient/route.ts    # DELETE
├── productOperations/
│   ├── createProduct/route.ts
│   ├── updateProduct/route.ts
│   └── deleteProduct/route.ts
└── orderOperations/
    ├── createOrder/route.ts
    ├── updateOrder/route.ts
    └── deleteOrder/route.ts
```

Each route file exports HTTP method handlers (GET, POST, PUT, DELETE) and uses the Prisma singleton from `@/lib/db`.

### Page Structure & Components

The application has two main sections:

1. **Public Route**: `/` - Login page
2. **Protected Routes**: `/panel/*` - Admin dashboard with sidebar navigation

Panel pages follow this structure:
```
src/app/panel/
├── page.tsx                 # Dashboard with charts and stats
├── layout.tsx              # Sidebar layout wrapper
├── musteriler/             # Clients management
│   ├── page.tsx
│   └── _components/        # Client-specific components
├── urunler/               # Products management
│   ├── page.tsx
│   └── _components/
└── satislar/              # Orders management
    ├── page.tsx
    └── _components/
```

Each entity page (`musteriler`, `urunler`, `satislar`) has dedicated `_components/` folders containing:
- `create-*-dialog.tsx` - Creation dialog
- `update-*-dialog.tsx` - Edit dialog
- `delete-*-dialog.tsx` - Delete confirmation
- `filter-bar.tsx` - Search/filter UI

### UI Component Library

- **Base UI**: Radix UI primitives (`@radix-ui/react-*`)
- **Styling**: Tailwind CSS v4 with custom utilities
- **Charts**: Recharts library
- **Path Alias**: `@/*` maps to `src/*`

Reusable components in `src/components/ui/`:
- Form controls: `button.tsx`, `input.tsx`, `label.tsx`, `select.tsx`
- Modals: `dialog.tsx`, `popover.tsx`
- Data display: `card.tsx`, `chart.tsx`, `pagination.tsx`
- Custom charts: `chart-area-gradient.tsx`, `chart-pie-legend.tsx`

## Data Denormalization Pattern

The `Order` model stores both foreign keys (`clientId`, `productId`) AND denormalized display names (`clientName`, `productName`). This is intentional for performance - it avoids JOIN queries when listing orders but requires updates when client/product names change.

## Turkish Language Context

The application uses Turkish terminology:
- **müşteriler** = clients
- **ürünler** = products
- **satışlar** = orders/sales

Variable names and code are in English, but UI text and route paths use Turkish.
