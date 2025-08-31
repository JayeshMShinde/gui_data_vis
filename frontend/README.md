# DataViz Pro Frontend

Modern React application built with Next.js 14, providing an intuitive interface for data visualization and machine learning.

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (dashboard)/        # Dashboard layout group
│   │   │   ├── data/          # Data management page
│   │   │   ├── visualize/     # Visualization page
│   │   │   └── ml/            # Machine learning page
│   │   ├── reports/           # Reports page
│   │   ├── sessions/          # Session management
│   │   ├── settings/          # User preferences
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   │   ├── charts/           # Chart components
│   │   ├── data-table/       # Data table components
│   │   ├── layout/           # Layout components
│   │   ├── ml-models/        # ML training components
│   │   └── ui/               # UI components
│   ├── contexts/             # React contexts
│   │   ├── SessionContext.tsx # Session management
│   │   └── ThemeContext.tsx   # Theme management
│   └── lib/                  # Utilities
│       ├── api.ts            # API client
│       └── utils.ts          # Helper functions
├── public/                   # Static assets
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.js          # Next.js configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Access Application
- **Development**: http://localhost:3000
- **Production**: http://localhost:3000

## 📦 Dependencies

### **Core Framework**
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### **State Management**
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form handling

### **UI Components**
- `@radix-ui/*` - Headless UI components
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `sonner` - Toast notifications

### **Data Visualization**
- Chart generation handled by backend
- Base64 image display

## 🎨 Design System

### **Theme System**
- **Light/Dark Mode** - System preference support
- **6 Color Palettes** - Blue, Purple, Green, Orange, Red, Pink
- **CSS Variables** - Dynamic theming
- **Responsive Design** - Mobile-first approach

### **Color Palettes**
```css
/* Blue (Default) */
--primary: oklch(0.646 0.222 264.376);

/* Purple */
--primary: oklch(0.627 0.265 303.9);

/* Green */
--primary: oklch(0.696 0.17 162.48);
```

### **Components**
- **Cards** - Content containers
- **Buttons** - Interactive elements
- **Forms** - Data input
- **Tables** - Data display
- **Modals** - Overlays
- **Navigation** - Sidebar and breadcrumbs

## 🧩 Components

### **Layout Components**
```typescript
// Sidebar navigation
<Sidebar />

// Dashboard wrapper
<DashboardLayout>
  {children}
</DashboardLayout>
```

### **Data Components**
```typescript
// File upload with drag-and-drop
<FileUpload onUpload={handleUpload} />

// Interactive data table
<DataTable columns={columns} data={data} />

// Data cleaning controls
<DataCleaningControls 
  sessionId={sessionId}
  onCleaningAction={handleAction}
/>
```

### **Chart Components**
```typescript
// Chart generator with recommendations
<ChartGenerator
  sessionId={sessionId}
  columns={columns}
  numericColumns={numericColumns}
  categoricalColumns={categoricalColumns}
/>
```

### **ML Components**
```typescript
// ML training interface
<MLTraining
  sessionId={sessionId}
  columns={columns}
  numericColumns={numericColumns}
/>
```

## 🔄 State Management

### **React Query**
```typescript
// Data fetching
const { data, isLoading } = useQuery({
  queryKey: ['sessions'],
  queryFn: getAllSessions
});

// Mutations
const mutation = useMutation({
  mutationFn: saveSession,
  onSuccess: () => {
    queryClient.invalidateQueries(['sessions']);
  }
});
```

### **Context Providers**
```typescript
// Theme management
const { theme, setTheme, colorPalette, setColorPalette } = useTheme();

// Session management
const { currentSessionId, setCurrentSessionId, hasActiveSession } = useSession();
```

## 🛠️ API Integration

### **Centralized API Client**
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Typed API functions
export async function uploadData(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/data/upload', formData);
  return res.data;
}
```

### **Error Handling**
```typescript
// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error('API Error', {
      description: error.response?.data?.detail || error.message
    });
    return Promise.reject(error);
  }
);
```

## 🎯 Features

### **Data Management**
- Drag-and-drop file upload
- Real-time data preview
- Interactive data cleaning
- Session persistence

### **Visualization**
- 7 chart types
- Smart column recommendations
- Interactive configuration
- Real-time chart generation

### **Machine Learning**
- 5 supervised algorithms
- Clustering and PCA
- Feature recommendations
- Model explanations

### **Reports**
- 4 report types
- Professional layouts
- Export capabilities
- Historical access

### **User Experience**
- Dark/light mode toggle
- Customizable color palettes
- Responsive design
- Toast notifications
- Loading states
- Error boundaries

## 🧪 Testing

### **Unit Tests**
```bash
npm test
```

### **E2E Tests**
```bash
npm run test:e2e
```

### **Type Checking**
```bash
npm run type-check
```

## 🚀 Deployment

### **Vercel Deployment**
```bash
npm run build
vercel --prod
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Static Export**
```bash
npm run build
npm run export
```

## ⚡ Performance

### **Optimization Features**
- Next.js App Router
- Server-side rendering
- Image optimization
- Code splitting
- Bundle analysis

### **Bundle Analysis**
```bash
npm run analyze
```

### **Performance Monitoring**
- Core Web Vitals
- Loading performance
- Runtime performance
- Memory usage

## 🔧 Configuration

### **Next.js Config**
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
};
```

### **Tailwind Config**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
      },
    },
  },
};
```

### **TypeScript Config**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🐛 Debugging

### **Development Tools**
- React Developer Tools
- Next.js DevTools
- TanStack Query DevTools
- Browser DevTools

### **Error Boundaries**
```typescript
// Error boundary for graceful error handling
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

## 📱 Responsive Design

### **Breakpoints**
```css
/* Tailwind breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### **Mobile-First Approach**
- Touch-friendly interfaces
- Responsive navigation
- Optimized layouts
- Performance considerations

---

**Frontend Application** - Beautiful, fast, and intuitive! ✨