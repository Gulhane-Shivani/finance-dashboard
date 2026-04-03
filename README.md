# Zorvyn Fin | Smart Finance Dashboard

A premium, modern finance dashboard built with React and Tailwind CSS. This dashboard provides a comprehensive view of your financial health, featuring real-time transaction tracking, insightful data visualizations, and robust state management.

## ✨ Key Features

- **📊 Comprehensive Dashboard**: Real-time summary of Total Balance, Income, Expenses, and Savings.
- **📈 Interactive Data Visualization**: Beautiful area and bar charts using Recharts for cash flow analysis.
- **📁 Advanced Transaction Management**:
  - Full CRUD operations (Add, Edit, Delete).
  - Search by keyword.
  - Multi-filter (Category, Transaction Type).
  - Dynamic sorting (Date, Amount).
  - Export functionality (CSV).
- **🌓 Adaptive UI**: Elegant Light and Dark mode support with smooth transitions.
- **🔐 Role-Based Access Control (Frontend Simulation)**:
  - **Admin**: Full control over transactions.
  - **Viewer**: Read-only access to data.
- **💡 Smart Financial Insights**: Automated calculations for savings rates and high-spending categories.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices.
- **💾 Persistent State**: Data is automatically saved to LocalStorage using Zustand.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Utilities**: [clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)

## 📁 Project Structure

```text
src/
├── components/
│   ├── ui/             # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── layout/         # Layout components (Sidebar, Header)
│   ├── dashboard/      # Dashboard-specific components (SummaryCards, Insights)
│   └── transactions/   # Transaction modules (Table, Modal, Filters)
├── pages/              # Primary application views (Dashboard, Transactions)
├── store/              # Zustand state stores
├── data/               # Mock data and constants
├── utils/              # Helper functions (cn utility, formatting)
├── App.jsx             # Main routing and layout assembly
└── index.css           # Global styles and Tailwind configuration
```

## 🚀 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Smart_Finance_Dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📐 Architecture & Standards

- **Component-Driven Development**: Highly modular and reusable component architecture.
- **Atomic State**: State is centralized in Zustand, keeping components thin and logic separated.
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<nav>`, and other semantic elements for accessibility.
- **Design System**: A robust theme-based CSS architecture for consistent styling across the app.

---

Crafted with ❤️ by **Antigravity AI**.
