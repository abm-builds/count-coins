# Count Coins - Personal Finance PWA

A modern Progressive Web Application for personal finance management built with React, TypeScript, and Vite.

## Project Structure

This project follows a clean architecture pattern with clear separation of concerns:

```
count-coins/
├── frontend/                 # Frontend application
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/         # Base UI components (shadcn/ui)
│   │   ├── contexts/       # React contexts for state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   ├── main.tsx        # Application entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.ts  # Tailwind CSS configuration
│   ├── tsconfig.app.json   # TypeScript configuration
│   └── eslint.config.js    # ESLint configuration
├── package.json            # Root workspace configuration
├── tsconfig.json          # Root TypeScript configuration
└── README.md              # This file
```

## Architecture Principles

### 1. **Separation of Concerns**
- **Frontend**: All client-side code is contained in the `frontend/` directory
- **Configuration**: Each module has its own configuration files
- **Dependencies**: Frontend dependencies are isolated in `frontend/package.json`

### 2. **Clean Architecture**
- **Components**: Organized by functionality and reusability
- **Contexts**: Centralized state management
- **Hooks**: Reusable logic extraction
- **Pages**: Route-based component organization

### 3. **Modern Development Practices**
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling approach
- **Vite**: Fast development and build tooling

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   npm run install:frontend
   ```

### Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Preview production build:**
   ```bash
   npm run preview
   ```

4. **Run linting:**
   ```bash
   npm run lint
   ```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Project Features

- 📱 **Progressive Web App** - Installable and offline-capable
- 💰 **Personal Finance Management** - Track income, expenses, and budgets
- 📊 **Data Visualization** - Charts and graphs for financial insights
- 🎨 **Modern UI** - Clean, responsive design with dark/light themes
- 🔒 **Type Safety** - Full TypeScript coverage
- ⚡ **Performance** - Optimized for speed and efficiency

## Contributing

1. Follow the established architecture patterns
2. Maintain TypeScript strict mode compliance
3. Use ESLint for code quality
4. Write clean, readable code with proper documentation
5. Test your changes thoroughly

## License

This project is private and proprietary.