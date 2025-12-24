# Development Guide

## Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 9.x or higher (or yarn/pnpm)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5050/v1
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Development Workflow

### 1. **Feature Development**

#### Create a new branch
```bash
git checkout -b feature/your-feature-name
```

#### Make changes
- Write code
- Add tests
- Update documentation

#### Commit changes
```bash
git add .
git commit -m "feat: add new feature"
```

#### Push to remote
```bash
git push origin feature/your-feature-name
```

#### Create Pull Request
- Open PR on GitHub
- Request code review
- Address feedback
- Merge when approved

### 2. **Commit Message Convention**

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(product): add product variant support"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs: update API integration guide"
```

---

## Project Structure

```
client/
├── public/                 # Static assets
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/               # Next.js app router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── globals.css    # Global styles
│   │   └── [routes]/      # Route folders
│   ├── components/        # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   └── global/       # Global components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── services/         # API services
│   │   └── api/          # API endpoints
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   └── middleware.ts     # Next.js middleware
├── docs/                 # Documentation
├── .env                  # Environment variables
├── .gitignore
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json
```

---

## Adding New Features

### 1. **Create a New Page**

```bash
# Create route folder
mkdir -p src/app/my-page

# Create page component
touch src/app/my-page/page.tsx
```

```typescript
// src/app/my-page/page.tsx
export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  );
}
```

### 2. **Create a New Component**

```bash
touch src/components/my-component.tsx
```

```typescript
// src/components/my-component.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### 3. **Add API Service**

```bash
touch src/services/api/my-service.ts
```

```typescript
// src/services/api/my-service.ts
import api from "@/lib/api";

export const getMyData = async (token: string) => {
  const response = await api.get("/my-endpoint", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
```

### 4. **Create Custom Hook**

```bash
touch src/hooks/useMyData.tsx
```

```typescript
// src/hooks/useMyData.tsx
import { useQuery } from "@tanstack/react-query";
import { getMyData } from "@/services/api/my-service";

export const useMyData = (token: string) => {
  return useQuery({
    queryKey: ["myData"],
    queryFn: () => getMyData(token),
    enabled: !!token,
  });
};
```

### 5. **Add Type Definitions**

```bash
touch src/types/my-types.ts
```

```typescript
// src/types/my-types.ts
export interface MyData {
  id: string;
  name: string;
  createdAt: Date;
}
```

---

## Styling Guide

### 1. **Using Tailwind CSS**

```typescript
<div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-foreground">Title</h2>
  <Button variant="outline">Action</Button>
</div>
```

### 2. **Responsive Design**

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### 3. **Dark Mode**

Use CSS variables defined in `globals.css`:

```typescript
<div className="bg-background text-foreground">
  {/* Automatically adapts to dark/light mode */}
</div>
```

### 4. **Custom Utilities**

Add to `tailwind.config.ts`:

```typescript
extend: {
  colors: {
    'custom-blue': '#1e40af',
  },
  spacing: {
    '128': '32rem',
  },
}
```

---

## State Management

### 1. **Local State (useState)**

For component-specific state:

```typescript
const [count, setCount] = useState(0);
```

### 2. **Global State (Zustand)**

For app-wide state:

```typescript
// store/cart-store.ts
import { create } from "zustand";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter((item) => item.id !== id) 
  })),
}));

// Usage in component
const { items, addItem } = useCartStore();
```

### 3. **Server State (React Query)**

For API data:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
});
```

---

## Form Handling

### 1. **Create Form Schema**

```typescript
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  price: z.number().min(0, "Price must be positive"),
});

type FormData = z.infer<typeof formSchema>;
```

### 2. **Create Form Component**

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      price: 0,
    },
  });
  
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

---

## Testing

### Unit Tests

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// __tests__/my-component.test.tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/components/my-component";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useMyData } from "@/hooks/useMyData";

describe("useMyData", () => {
  it("fetches data successfully", async () => {
    const { result } = renderHook(() => useMyData("token"));
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

---

## Debugging

### 1. **Browser DevTools**

- **React DevTools**: Inspect component tree
- **Network Tab**: Monitor API calls
- **Console**: View logs and errors

### 2. **VS Code Debugging**

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

### 3. **Logging**

```typescript
console.log("Debug:", data);
console.error("Error:", error);
console.table(arrayData);
```

---

## Performance Optimization

### 1. **Code Splitting**

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./heavy-component"), {
  loading: () => <Skeleton />,
});
```

### 2. **Image Optimization**

```typescript
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For above-the-fold images
/>
```

### 3. **Memoization**

```typescript
import { memo, useMemo, useCallback } from "react";

// Memoize component
export const MyComponent = memo(function MyComponent({ data }) {
  return <div>{data}</div>;
});

// Memoize value
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);

// Memoize callback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

---

## Common Tasks

### Add a shadcn/ui Component

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Update Dependencies

```bash
npm update
npm outdated  # Check for outdated packages
```

### Build for Production

```bash
npm run build
npm run start  # Test production build locally
```

### Lint Code

```bash
npm run lint
```

---

## Environment Variables

### Development (.env)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5050/v1
```

### Production
Set in deployment platform (Vercel, Netlify, etc.)

**Important:** Never commit `.env` files to Git!

---

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Type Errors
```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

---

## Code Quality

### ESLint Configuration

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "printWidth": 80
}
```

---

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `refactor/component-name` - Code refactoring
- `docs/topic` - Documentation updates

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here
```

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [React Query Docs](https://tanstack.com/query/latest)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Postman](https://www.postman.com/) - API testing

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [React Discord](https://discord.gg/react)

---

## Best Practices Checklist

- [ ] Use TypeScript for type safety
- [ ] Follow component naming conventions
- [ ] Write meaningful commit messages
- [ ] Add JSDoc comments to complex functions
- [ ] Handle loading and error states
- [ ] Make components accessible
- [ ] Optimize images
- [ ] Use semantic HTML
- [ ] Test your code
- [ ] Keep components small and focused
- [ ] Use custom hooks for reusable logic
- [ ] Follow the DRY principle
- [ ] Document your code

---

## Getting Help

1. **Check Documentation**: Review project docs first
2. **Search Issues**: Look for similar issues on GitHub
3. **Ask Team**: Reach out to team members
4. **Create Issue**: If bug, create detailed issue report
5. **Community**: Ask in relevant Discord/Slack channels

---

## Next Steps

After setting up your development environment:

1. Read the [Architecture Documentation](./ARCHITECTURE.md)
2. Review the [Component Structure](./COMPONENTS.md)
3. Explore the [API Integration Guide](./API_INTEGRATION.md)
4. Check out the [Features Documentation](./FEATURES.md)
5. Start building! 🚀
