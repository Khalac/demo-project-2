# Leave Tools Management

A comprehensive web application for managing employee leave requests and approvals efficiently. Built with modern web technologies including React, TypeScript, and Vite, featuring a responsive design and real-time updates.

## 📋 Requirements & Status

### Core Requirements

#### User Management

- [x] User authentication and authorization
- [x] Role-based access control (Admin, Manager, Employee)
- [x] User profile management
- [x] Password reset functionality

#### Leave Management

- [x] Leave balance tracking
- [x] Leave request submission
- [x] Leave approval workflow
- [x] Leave cancellation
- [x] Leave history

#### Notifications

- [x] Notifications for:
  - Leave request submissions
  - Request approvals/rejections
  - Balance updates
- [x] Real-time updates

#### Reporting

- [x] Leave usage reports
- [x] Department-wise reports
- [x] Custom date range reports
- [x] Export to Excel functionality

### Additional Features

- [x] Responsive design for all devices
- [x] Real-time data updates
- [x] Data visualization dashboards
- [x] File attachments for leave requests

### Current Status

✅ All core requirements have been implemented
✅ Application is fully functional and ready for production
✅ Testing completed for all major features
✅ Documentation is up-to-date

## 🌟 Key Features

### User Management & Authentication

- 👤 Secure user authentication with Supabase Auth
- 🔐 Role-based access control (Admin, Manager, Employee)
- 👥 User profile management
- 🔑 Password reset and email verification

### Leave Management

- ⏰ Leave duration calculation (Full day, Half day)
- 📝 Leave request form with validation
- 📎 Attachment support for leave requests
- 💬 Comments and feedback system

### Approval Workflow

- ✅ Multi-level approval process
- 📨 Notifications for:
  - New leave requests
  - Request approvals/rejections
  - Request updates
- 📱 Real-time status updates
- 🔄 Leave request modification and cancellation

### Dashboard & Analytics

- 📊 Interactive dashboards for:
  - Leave balance overview
  - Department-wise leave statistics
  - Monthly/Yearly leave trends
- 📈 Data visualization using Recharts:
  - Leave usage charts
  - Approval rate analytics
  - Department statistics
- 📉 Custom date range filters
- 🎯 Key metrics tracking

### Reports & Exports

- 📤 Export functionality:
  - Excel export with XLSX
  - Custom date range selection
- 📋 Detailed leave history records
- 📊 Department-wise reports

### UI/UX Features

- 🎨 Modern and clean interface using Shadcn/UI
- 📱 Fully responsive design for all devices
- 🔍 Advanced search and filtering

## 🛠 Tech Stack

### Frontend Technologies

- **React 19**
  - Functional components
  - Custom hooks
  - Context API
  - Error boundaries
- **TypeScript**
  - Strict type checking
  - Interface definitions
  - Type safety
- **State Management**
  - Redux Toolkit for global state
  - RTK Query for API calls
  - Redux Persist for state persistence
- **Routing & Forms**
  - React Router DOM v7
  - React Hook Form for form management
  - Zod for schema validation
- **UI Components & Styling**
  - Tailwind CSS for styling
  - Shadcn/UI component library
  - Lucide React for icons
  - Class Variance Authority
  - Tailwind Merge for class management
- **Data Visualization**
  - Recharts for charts and graphs
  - React Day Picker for date selection
  - Custom visualization components

### Backend Services (Supabase)

- **Authentication**
  - Email/Password authentication
  - OAuth providers support
  - JWT token management
- **Database**
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
- **Storage**
  - File storage for attachments
  - Secure file access control
- **Security**
  - API key management
  - Environment variables
  - Security policies

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Git
- A Supabase account

### Environment Setup

1. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_api_base_url
```

### Installation Steps

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

4. Build for production

```bash
npm run build
# or
yarn build
```

5. Preview production build

```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
src/
├── assets/                # Static assets and images
│   ├── images/
│   └── icons/
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── shared/           # Shared components
├── features/             # Feature-specific components
│   ├── auth/             # Authentication features
│   ├── leave/            # Leave management features
│   ├── dashboard/        # Dashboard features
│   └── reports/          # Reporting features
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client
│   └── validators/       # Zod schemas
├── pages/                # Page components
├── redux-store/          # Redux state management
│   ├── slices/           # Redux slices
│   ├── services/         # RTK Query services
│   └── store.ts          # Redux store configuration
├── router/               # Route configurations
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🔄 Development Workflow

1. **Feature Development**

   - Create feature branch from `develop`
   - Implement feature with tests
   - Create pull request to `develop`

2. **Code Quality**

   - ESLint for code linting
   - Prettier for code formatting
   - TypeScript for type checking

3. **Testing**

   - Unit tests with Jest
   - Integration tests
   - E2E tests with Cypress

4. **Deployment**
   - Automated builds with GitHub Actions
   - Deployment to Vercel/Netlify
   - Environment-specific configurations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m 'Add some amazing feature'
```

4. Push to the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Update documentation as needed
- Add tests for new features
- Update the changelog

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

## 🙏 Acknowledgments

- Shadcn/UI for the beautiful components
- Supabase team for the backend infrastructure
- All contributors who have helped with the project
