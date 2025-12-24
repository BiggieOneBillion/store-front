# Multi-Store E-Commerce Platform

A comprehensive multi-vendor e-commerce platform built with Next.js 15, enabling sellers to manage their stores and buyers to shop across multiple vendors in a unified marketplace.

## 🌟 Overview

Multi-Store is a modern, full-featured e-commerce platform that supports multiple vendors (sellers) and provides a seamless shopping experience for buyers. The platform includes robust product management, inventory tracking, order processing, payment integration, and comprehensive analytics.

## ✨ Key Features

### For Buyers
- **Product Discovery**: Browse products across multiple stores with advanced filtering and search
- **Shopping Cart**: Add products to cart with variant selection
- **Wishlist**: Save favorite products for later
- **Secure Checkout**: Integrated payment processing with Paystack
- **Order Tracking**: View order history and track order status
- **User Accounts**: Manage profile, addresses, and preferences

### For Sellers
- **Store Management**: Create and customize your store
- **Product Management**: Add, edit, and delete products with variants and specifications
- **Inventory Tracking**: Real-time stock monitoring with low-stock alerts
- **Order Management**: Process orders, update statuses, and manage fulfillment
- **Discount Management**: Create and manage promotional codes and discounts
- **Sales Analytics**: Track sales performance and identify top-selling products
- **Category Management**: Organize products into categories
- **Payment Tracking**: Monitor payments and transaction history
- **Customer Management**: View customer information and purchase history

### Platform Features
- **Multi-Vendor Support**: Multiple sellers can operate independent stores
- **Authentication & Authorization**: Secure JWT-based authentication with role-based access
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Built-in theme switching
- **Real-time Updates**: Live inventory and order status updates
- **Image Management**: Multi-image upload for products
- **Advanced Search**: Filter products by name, category, price, and more

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=<your-backend-api-url>
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md) - System architecture and design patterns
- [Tech Stack](./TECH_STACK.md) - Technologies and libraries used
- [Features](./FEATURES.md) - Detailed feature documentation
- [API Integration](./API_INTEGRATION.md) - Backend API integration guide
- [Components](./COMPONENTS.md) - Component structure and usage
- [Development Guide](./DEVELOPMENT.md) - Development workflow and best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Payment**: Paystack
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── _component/         # Shared layout components
│   │   ├── account/            # User account & dashboard
│   │   ├── auth/               # Authentication pages
│   │   ├── checkout/           # Checkout flow
│   │   ├── product/            # Product detail pages
│   │   └── shop/               # Shop/catalog pages
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── global/             # Global components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── services/               # API service layer
│   │   └── api/                # API endpoints
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript type definitions
│   └── middleware.ts           # Next.js middleware
├── public/                     # Static assets
└── docs/                       # Documentation
```

## 🔐 Authentication Flow

The platform uses JWT-based authentication with the following flow:

1. User registers or logs in
2. Backend returns access token and refresh token
3. Access token stored in memory, refresh token in HTTP-only cookie
4. Middleware protects routes requiring authentication
5. Automatic token refresh on expiration

## 🎨 Design System

The platform uses a consistent design system built on:
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Theme customization via HSL color system

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
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Paystack](https://paystack.com/) - Payment processing

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js and TypeScript**
