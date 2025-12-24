# Multi-Store E-Commerce Platform

A comprehensive multi-vendor e-commerce platform built with Next.js 15, enabling sellers to manage their stores and buyers to shop across multiple vendors in a unified marketplace.

## 🌟 Overview

Multi-Store is a modern, full-featured e-commerce platform that supports multiple vendors (sellers) and provides a seamless shopping experience for buyers. The platform includes robust product management, inventory tracking, order processing, payment integration, and comprehensive analytics.

## ✨ Key Features

### For Buyers
- Product discovery with advanced filtering and search
- Shopping cart and wishlist
- Secure checkout with Paystack integration
- Order tracking and history
- User account management

### For Sellers
- Complete store management
- Product management with variants and specifications
- Real-time inventory tracking with low-stock alerts
- Order processing and fulfillment
- Discount and promotion management
- Sales analytics and reporting
- Category and customer management

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your NEXT_PUBLIC_BACKEND_URL

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Overview & Getting Started](./docs/README.md)** - Project overview and quick start guide
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture, design patterns, and data flows
- **[Tech Stack](./docs/TECH_STACK.md)** - Technologies, libraries, and tools used
- **[Features](./docs/FEATURES.md)** - Detailed feature documentation for buyers and sellers
- **[API Integration](./docs/API_INTEGRATION.md)** - Backend API integration guide with all endpoints
- **[Components](./docs/COMPONENTS.md)** - Component structure, patterns, and best practices
- **[Development Guide](./docs/DEVELOPMENT.md)** - Development workflow and guidelines

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Payment**: Paystack

## 📁 Project Structure

```
client/
├── docs/                   # Comprehensive documentation
├── src/
│   ├── app/               # Next.js app router pages
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── store/            # State management
│   └── types/            # TypeScript types
└── public/               # Static assets
```

## 📦 Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [Development Guide](./docs/DEVELOPMENT.md) for detailed workflow.

## 📄 License

This project is licensed under the MIT License.

---

**For detailed documentation, please visit the [docs](./docs/) directory.**
