# 🕯️ Quiet Flame

A modern, responsive, SEO-friendly candle e-commerce website with a secure admin dashboard.

Design reference: [quietflame.shop](https://www.quietflame.shop/) (same layout and elegant style, with an **orange + chocolate** color theme).

---

## ✨ Features

### Public Website

- Home page: Hero, Collection, Craft/About, Reviews, CTA
- Products listing (`/products`) and product details (`/products/[slug]`)
- Shopping cart (drawer + `/cart` page), persisted in `localStorage`
- Checkout without customer account or login
- US-only address autocomplete (Geoapify) with manual-entry fallback
- Order confirmation page
- Product discount display (`compareAtPrice` + "Save %" badge)
- About, Contact, Privacy Policy, Terms pages
- Loading skeletons, empty states, custom 404

### Admin Dashboard (`/admin`)

- Secure login (email + password)
- Dashboard summary (products, orders, revenue, pending payments)
- Product management: create, edit, delete (soft-delete), activate/deactivate, stock, discount
- Order management: search, filter, pagination, status updates
- Account: update name/email, change password
- **Site Settings**: brand name, logo URL, address, website URL, phone, email, social links
  (all header, footer, contact and SEO data come from here, nothing is hard-coded)

### Payments

- No payment gateway in the first version
- Order model is already PayPal-ready (`paymentStatus`, `paymentMethod`, `transactionId`)

---

## 🧰 Tech Stack

| Area            | Technology                                          |
| --------------- | --------------------------------------------------- |
| Framework       | Next.js (App Router), TypeScript                    |
| Styling         | Tailwind CSS                                        |
| Database        | MongoDB + Mongoose (MongoDB Atlas)                  |
| Validation      | Zod, React Hook Form                                |
| Auth            | Custom JWT (`jose`) + `bcryptjs`, HTTP-only cookie  |
| Cart state      | Zustand (`persist`)                                 |
| UI helpers      | lucide-react, sonner, clsx, tailwind-merge          |
| Address API     | Geoapify (server-side proxy, US only)               |
| Images          | External image URLs only (no upload, no Cloudinary) |
| Deployment      | Vercel + MongoDB Atlas                              |
| Package manager | pnpm                                                |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- A MongoDB Atlas cluster
- A Geoapify API key

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

```text
MONGODB_URI=
AUTH_SECRET=
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
GEOAPIFY_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Future (PayPal, not used yet)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

Generate a secure `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

> ⚠️ Never commit `.env.local`. Never share your MongoDB URI publicly.

### 3. Seed the database

Creates one admin account, sample candle products and default site settings:

```bash
pnpm seed
```

### 4. Run the development server

```bash
pnpm dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## 📜 Scripts

| Command      | Description                       |
| ------------ | --------------------------------- |
| `pnpm dev`   | Start development server          |
| `pnpm build` | Production build                  |
| `pnpm start` | Run production build              |
| `pnpm lint`  | Run ESLint                        |
| `pnpm seed`  | Seed admin, products and settings |

---

## 🗺️ Routes

**Public**

```text
/                                  Home
/products                          All active products
/products/[slug]                   Product details
/cart                              Cart
/checkout                          Checkout
/order-confirmation/[orderNumber]  Order confirmation
/about
/contact
/privacy-policy
/terms
```

**Admin**

```text
/admin/login
/admin
/admin/products
/admin/products/new
/admin/products/[id]/edit
/admin/orders
/admin/orders/[id]
/admin/account
/admin/settings
```

---

## 🛒 Customer Flow

```text
Products → Add to Cart / Buy Now → Cart → Checkout → Order Review → Place Order → Confirmation
```

**Buy Now** adds the product to the cart and goes straight to `/cart`.

---

## 🗄️ Data Models

| Model          | Purpose                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `Admin`        | Admin account, password hash, `tokenVersion`, login lock fields                                                          |
| `Product`      | Name, slug, description, price, `compareAtPrice`, currency, images (URLs), stock, `isActive`                             |
| `Order`        | Customer, shipping address, `items[]` (snapshot of name/image/price), totals, `discountAmount`, order and payment status |
| `SiteSettings` | Brand name, logo URL, address, URL, phone, email, social links                                                           |

Order statuses: `pending`, `confirmed`, `delivered`, `cancelled`
Payment statuses: `pending`, `paid`, `failed`, `refunded`
Payment methods: `unpaid`, `paypal`

---

## 🏗️ Project Structure

```text
src/
├── app/
│   ├── (public)/        Public pages
│   ├── admin/           Login + (dashboard) pages, Server Actions
│   └── api/             Route Handlers (orders, cart validate, address, PayPal later)
├── components/          ui, layout, home, products, cart, checkout, admin
├── lib/                 mongodb, auth, utils, constants, validation (Zod)
├── models/              Mongoose schemas
├── services/            All business logic
├── store/               Zustand cart store
├── types/
└── middleware.ts        Protects /admin/*
scripts/
└── seed.ts
```

**Architecture rule:** business logic lives in `services/`. Server Actions and Route Handlers are thin wrappers: authenticate, validate, call a service, return the result. Components contain UI only.

**Server Actions vs API**

- Server Actions: admin login/logout, product/order/account/settings mutations
- Route Handlers: customer order creation, cart validation, address suggestions, PayPal webhook (future)

---

## 🔐 Security

- Passwords hashed with bcrypt (12+ rounds); no plain-text passwords
- JWT in an HTTP-only, `secure`, `sameSite=lax` cookie with limited lifetime
- `middleware.ts` **and** per-action/route `getCurrentAdmin()` checks
- Brute-force protection: 5 failed logins lock the account for 15 minutes
- Password change requires the current password and invalidates old sessions (`tokenVersion`)
- Server-side Zod validation on every input
- **Prices, discounts and totals are always calculated on the server** from database values; frontend prices are never trusted
- Stock verified and decremented atomically when an order is placed
- Secure headers configured in `next.config.ts`
- No secrets in frontend code or the repository
- No public admin registration endpoint

---

## 🔍 SEO

- Dynamic metadata (title, description, Open Graph, Twitter) driven by Site Settings
- Product pages: dynamic metadata, canonical URL, JSON-LD `Product` structured data
- `sitemap.xml` and `robots.txt` (`/admin` blocked)
- Semantic HTML, proper heading hierarchy, image alt text
- `next/image` optimization and revalidation where appropriate

---

## ☁️ Deployment

1. Push the code to GitHub (without secrets).
2. Create a production cluster on **MongoDB Atlas** and allow access from Vercel (`0.0.0.0/0`).
3. Import the repository into **Vercel**.
4. Add all environment variables in the Vercel dashboard.
5. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
6. Run `pnpm seed` once against the production database to create the admin.
7. Connect the domain and test the full order flow.

> Note: Vercel's free Hobby plan is for non-commercial use. A live store should use a paid plan.

---

## 🧪 Pre-Release Checklist

- [ ] All public pages work and are responsive (320px to 1440px+, no horizontal scroll)
- [ ] Cart, checkout and order creation work
- [ ] Order with out-of-stock or inactive product is rejected
- [ ] Tampered frontend price is ignored by the server
- [ ] Admin login, logout, wrong password and lockout work
- [ ] Unauthenticated access to `/admin` and admin actions is blocked
- [ ] Product CRUD, order status update, settings and password change work
- [ ] `pnpm lint` and `pnpm build` pass
- [ ] Sitemap and robots.txt available

---

## 🛣️ Roadmap (Not in the first version)

- PayPal integration (create payment, server-side verification, webhook)
- Email notifications (e.g. Resend)
- Advanced analytics
- Customer accounts, reviews, coupons, multiple admins, shipping integration

---

## 🎨 Theme Tokens

| Token            | Color     | Use                             |
| ---------------- | --------- | ------------------------------- |
| `primary`        | `#E8751A` | Buttons, CTA, highlights        |
| `primary-dark`   | `#C85F0F` | Hover                           |
| `chocolate`      | `#3B2314` | Headings, footer, dark sections |
| `chocolate-soft` | `#6B4A35` | Secondary text                  |
| `background`     | `#FFF8F0` | Page background                 |
| `surface`        | `#FFFFFF` | Cards                           |
| `border`         | `#EADBCB` | Borders                         |

---

## ⚠️ Development Rules

- Work incrementally, phase by phase
- Check TypeScript, lint and build after each phase
- Do not change the tech stack without approval
- Do not add features outside the requirements
- Keep components small and reusable; avoid `any`

---

## 📄 License

Private project. All rights reserved.
