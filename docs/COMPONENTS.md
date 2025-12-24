# Component Structure Documentation

## Overview

This document outlines the component architecture, organization, and usage patterns in the Multi-Store platform.

## Component Organization

```
src/
├── components/              # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   ├── global/             # Global shared components
│   ├── app-sidebar.tsx     # Application sidebar
│   ├── login-form.tsx      # Login form component
│   └── search-form.tsx     # Search form component
├── app/                    # Page-specific components
│   ├── _component/         # Shared layout components
│   └── [feature]/          # Feature-specific components
└── global-components/      # App-wide components
```

## Component Categories

### 1. **UI Components** (`components/ui/`)

Pre-built, customizable components from shadcn/ui:

#### Form Components
- `button.tsx` - Button with variants
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `checkbox.tsx` - Checkbox input
- `select.tsx` - Dropdown select
- `slider.tsx` - Range slider
- `switch.tsx` - Toggle switch
- `label.tsx` - Form label
- `calendar.tsx` - Date picker calendar
- `form.tsx` - Form wrapper with validation

#### Layout Components
- `card.tsx` - Card container
- `separator.tsx` - Visual divider
- `scroll-area.tsx` - Custom scrollable area
- `tabs.tsx` - Tab navigation
- `collapsible.tsx` - Collapsible sections
- `sidebar.tsx` - Sidebar layout

#### Feedback Components
- `alert-dialog.tsx` - Confirmation dialogs
- `dialog.tsx` - Modal dialogs
- `toast.tsx` - Toast notifications
- `progress.tsx` - Progress bar
- `skeleton.tsx` - Loading skeleton
- `tooltip.tsx` - Tooltips

#### Navigation Components
- `dropdown-menu.tsx` - Dropdown menus
- `popover.tsx` - Popovers
- `command.tsx` - Command palette

#### Data Display
- `table.tsx` - Data tables
- `badge.tsx` - Status badges
- `avatar.tsx` - User avatars

**Usage Example:**

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### 2. **Global Components** (`components/global/`)

Shared components used across the application:

- `navbar.tsx` - Main navigation bar
- `footer.tsx` - Site footer
- `theme-toggle.tsx` - Dark/light mode toggle
- `user-menu.tsx` - User account menu

### 3. **Layout Components** (`app/_component/`)

Components that define the application layout:

#### **navbar.tsx**
Main navigation bar with:
- Logo
- Search bar
- Navigation links
- User menu
- Shopping cart icon

```typescript
<Navbar>
  <Logo />
  <SearchBar />
  <NavLinks />
  <UserMenu />
  <CartIcon />
</Navbar>
```

#### **footer.tsx**
Site footer with:
- Company information
- Quick links
- Social media links
- Newsletter signup

#### **which-layout.tsx**
Conditional layout wrapper that determines which layout to use based on the route.

#### **user-status.tsx**
Manages user authentication status and provides user context.

### 4. **Feature Components**

Components organized by feature/page:

#### Home Components (`app/_component/home/`)
- `home-view.tsx` - Main home page layout
- `hero-section.tsx` - Hero banner
- `categories.tsx` - Category grid
- `featured-product.tsx` - Featured products section
- `latest-products.tsx` - Latest products section

#### Dashboard Components (`app/account/dashboard/`)

Each dashboard feature has its own component structure:

```
dashboard/
├── _component/
│   ├── dashboard-header.tsx
│   ├── stats-card.tsx
│   └── recent-orders.tsx
├── product-management/
│   ├── _component/
│   │   ├── columns.tsx          # Table column definitions
│   │   ├── data-table.tsx       # Data table component
│   │   ├── product-form.tsx     # Product creation/edit form
│   │   └── product-actions.tsx  # Row actions
│   └── page.tsx
├── order-management/
├── stock-management/
└── ...
```

## Component Patterns

### 1. **Server vs Client Components**

#### Server Components (Default)
```typescript
// No "use client" directive
export default function ProductList() {
  // Can fetch data directly
  const products = await getProducts();
  
  return <div>{/* Render products */}</div>;
}
```

#### Client Components
```typescript
"use client";

import { useState } from "react";

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. **Compound Components**

Used for flexible, composable components:

```typescript
// Card compound component
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Footer */}
  </CardFooter>
</Card>
```

### 3. **Render Props Pattern**

Used in data tables:

```typescript
<DataTable
  columns={columns}
  data={data}
  renderRow={(row) => <CustomRow row={row} />}
/>
```

### 4. **Component Composition**

Build complex UIs from simple components:

```typescript
function ProductCard({ product }) {
  return (
    <Card>
      <CardHeader>
        <ProductImage src={product.image} />
        <ProductTitle>{product.name}</ProductTitle>
      </CardHeader>
      <CardContent>
        <ProductPrice price={product.price} />
        <ProductDescription>{product.description}</ProductDescription>
      </CardContent>
      <CardFooter>
        <AddToCartButton productId={product.id} />
      </CardFooter>
    </Card>
  );
}
```

## Data Table Components

### Structure

```typescript
// columns.tsx - Define table columns
export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatCurrency(row.getValue("price")),
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];

// data-table.tsx - Table component
export function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  
  return (
    <Table>
      <TableHeader>
        {/* Header rows */}
      </TableHeader>
      <TableBody>
        {/* Data rows */}
      </TableBody>
    </Table>
  );
}
```

### Usage

```typescript
import { columns } from "./_component/columns";
import { DataTable } from "./_component/data-table";

export default function ProductManagement() {
  const { data: products } = useProducts();
  
  return <DataTable columns={columns} data={products} />;
}
```

## Form Components

### Form Structure

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Styling Patterns

### 1. **Tailwind Classes**

```typescript
<div className="flex items-center justify-between p-4 bg-card rounded-lg">
  <h2 className="text-2xl font-bold">Title</h2>
  <Button variant="outline" size="sm">Action</Button>
</div>
```

### 2. **Conditional Classes**

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>
  Content
</div>
```

### 3. **Component Variants**

```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "base-button-classes",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

<Button variant="outline" size="sm">Button</Button>
```

## Component Best Practices

### 1. **Single Responsibility**
Each component should do one thing well.

```typescript
// ✅ Good - Single responsibility
function ProductPrice({ price }) {
  return <span className="font-bold">{formatCurrency(price)}</span>;
}

// ❌ Bad - Multiple responsibilities
function ProductCard({ product }) {
  // Handles rendering, data fetching, and business logic
}
```

### 2. **Prop Types**
Always define TypeScript interfaces for props.

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  showActions?: boolean;
}

export function ProductCard({ product, onAddToCart, showActions = true }: ProductCardProps) {
  // Component logic
}
```

### 3. **Default Props**
Use default parameters for optional props.

```typescript
function Button({ 
  variant = "default", 
  size = "md", 
  children 
}: ButtonProps) {
  // Component logic
}
```

### 4. **Composition Over Inheritance**
Prefer composition to build complex components.

```typescript
// ✅ Good - Composition
<Card>
  <CardHeader>
    <ProductImage />
    <ProductTitle />
  </CardHeader>
  <CardContent>
    <ProductDetails />
  </CardContent>
</Card>

// ❌ Bad - Inheritance
class ProductCard extends Card {
  // Complex inheritance hierarchy
}
```

### 5. **Extract Reusable Logic**
Use custom hooks for reusable logic.

```typescript
// Custom hook
function useProductActions(productId: string) {
  const addToCart = () => {/* logic */};
  const addToWishlist = () => {/* logic */};
  
  return { addToCart, addToWishlist };
}

// Component
function ProductCard({ product }) {
  const { addToCart, addToWishlist } = useProductActions(product.id);
  
  return (
    <Card>
      <Button onClick={addToCart}>Add to Cart</Button>
      <Button onClick={addToWishlist}>Add to Wishlist</Button>
    </Card>
  );
}
```

### 6. **Loading and Error States**
Always handle loading and error states.

```typescript
function ProductList() {
  const { data, isLoading, error } = useProducts();
  
  if (isLoading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.length) return <EmptyState />;
  
  return (
    <div>
      {data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 7. **Accessibility**
Ensure components are accessible.

```typescript
<button
  aria-label="Add to cart"
  aria-pressed={isInCart}
  onClick={handleAddToCart}
>
  <ShoppingCart />
</button>
```

## Component Testing

### Unit Testing

```typescript
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./product-card";

test("renders product name", () => {
  const product = { id: "1", name: "Test Product", price: 99.99 };
  render(<ProductCard product={product} />);
  
  expect(screen.getByText("Test Product")).toBeInTheDocument();
});
```

### Integration Testing

```typescript
test("adds product to cart", async () => {
  const { user } = render(<ProductCard product={product} />);
  
  await user.click(screen.getByRole("button", { name: /add to cart/i }));
  
  expect(screen.getByText("Added to cart")).toBeInTheDocument();
});
```

## Performance Optimization

### 1. **Memoization**

```typescript
import { memo } from "react";

export const ProductCard = memo(function ProductCard({ product }) {
  return <div>{/* Component */}</div>;
});
```

### 2. **Lazy Loading**

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./heavy-component"), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

### 3. **Virtual Lists**

For long lists, use virtualization:

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";

function ProductList({ products }) {
  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });
  
  return (
    <div ref={parentRef}>
      {virtualizer.getVirtualItems().map(item => (
        <ProductCard key={item.key} product={products[item.index]} />
      ))}
    </div>
  );
}
```

## Component Documentation

Each complex component should include:

```typescript
/**
 * ProductCard component displays product information in a card layout.
 * 
 * @param {Product} product - The product to display
 * @param {Function} onAddToCart - Callback when add to cart is clicked
 * @param {boolean} showActions - Whether to show action buttons
 * 
 * @example
 * <ProductCard 
 *   product={product} 
 *   onAddToCart={handleAddToCart}
 *   showActions={true}
 * />
 */
export function ProductCard({ product, onAddToCart, showActions }: ProductCardProps) {
  // Component implementation
}
```

## Component Checklist

When creating a new component:

- [ ] Define TypeScript interface for props
- [ ] Handle loading and error states
- [ ] Add accessibility attributes
- [ ] Use semantic HTML
- [ ] Follow naming conventions
- [ ] Extract reusable logic to hooks
- [ ] Add JSDoc comments
- [ ] Test the component
- [ ] Optimize for performance
- [ ] Ensure responsive design
