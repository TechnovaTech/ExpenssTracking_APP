# Expense Tracker Admin Backend

Next.js TypeScript backend with MongoDB for expense tracking with user-wise database separation.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure MongoDB in `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key-change-this
```

3. Run development server:
```bash
npm run dev
```

## Database Structure

- **Admin Database**: `expenss_tracker_admin`
  - Collection: `users` (stores all user accounts)

- **User Databases**: `user_{userId}`
  - Collection: `expenses` (user-specific expenses)
  - Collection: `categories` (user-specific categories)

## Seed Database

```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/profile` - Get user profile

### Expenses
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses` - Update expense
- `DELETE /api/expenses?id={id}` - Delete expense
- `GET /api/stats` - Get expense statistics

### Categories
- `GET /api/categories` - Get categories
- `POST /api/categories` - Create category
- `DELETE /api/categories?id={id}` - Delete category

### Payment Methods
- `GET /api/payment-methods` - Get payment methods
- `POST /api/payment-methods` - Create payment method
- `DELETE /api/payment-methods?id={id}` - Delete payment method

### Persons
- `GET /api/persons` - Get persons
- `POST /api/persons` - Create person
- `DELETE /api/persons?id={id}` - Delete person

### Income
- `GET /api/income` - Get user income
- `POST /api/income` - Create income
- `PUT /api/income` - Update income
- `DELETE /api/income?id={id}` - Delete income

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/expenses/{userId}` - Get user expenses

All protected routes require `Authorization: Bearer {token}` header.
