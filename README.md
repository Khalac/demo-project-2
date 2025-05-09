# Leave Tools Management

A modern web application for managing employee leave requests and approvals efficiently. Built with React, TypeScript, and Vite.

## Features

- 👥 User Authentication & Authorization
- 📅 Leave Request Management
- ✅ Leave Approval Workflow
- 📊 Dashboard & Analytics
- 📋 Leave History Tracking
- 📱 Responsive Design
- 🎨 Modern UI with Shadcn/UI Components
- 📈 Data Visualization with Recharts
- 📑 Excel Export Functionality

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Redux Toolkit (State Management)
- React Router DOM (Routing)
- React Hook Form (Form Management)
- Zod (Form Validation)
- Tailwind CSS (Styling)
- Shadcn/UI (UI Components)
- Recharts (Charts & Graphs)
- XLSX (Excel Export)

### Backend

- Supabase (Backend as a Service)
  - Authentication
  - Database
  - Real-time Updates

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd leave-tools-management
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Reusable UI components
├── features/      # Feature-specific components
├── hook/          # Custom React hooks
├── layout/        # Layout components
├── lib/           # Utility libraries
├── pages/         # Page components
├── redux-store/   # Redux state management
├── router/        # Route configurations
└── utils/         # Utility functions
```

## Features Status

✅ Completed:

- User Authentication
- Leave Request Management
- Leave Approval Workflow
- Dashboard & Analytics
- Leave History
- Excel Export
- Responsive Design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
