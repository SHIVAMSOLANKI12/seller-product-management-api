# Production-Ready Node.js Express Backend

A robust, scalable, and secure backend boilerplate built with Node.js, Express, and MongoDB.

## Features

### 🛡️ Security
- **Helmet**: Secure HTTP headers.
- **CORS**: Cross-Origin Resource Sharing enabled.
- **Rate Limiting**: Protects against brute-force and DDoS attacks.
- **NoSQL Injection Protection**: Prevents malicious MongoDB queries.
- **XSS Protection**: Sanitizes user input to prevent Cross-Site Scripting.
- **HPP**: Prevents HTTP Parameter Pollution.
- **JWT Auth**: Secure authentication with role-based access control.

### 🚀 Performance & Structure
- **MVC Architecture**: Clean separation of concerns.
- **Async Handler**: Reusable utility to handle async operations without try-catch bloat.
- **Pagination Utility**: Consistent pagination metadata across all listing APIs.
- **Centralized Error Handling**: Uniform error responses for all types of exceptions.
- **Response Formatter**: Standardized API response structure.

### 📖 Documentation
- **Swagger UI**: Interactive API documentation at `/api-docs`.

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure Environment Variables**
   - Create a `.env` file.
   - Update `MONGODB_URI` and `JWT_SECRET`.

3. **Run the server**
   - Development: `npm run dev`
   - Production: `npm start`

## API Modules

### 👤 Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### 🔑 Admin
- `POST /api/admin/login`
- `POST /api/admin/sellers` (Create Seller)
- `GET /api/admin/sellers` (List Sellers with Pagination)

### 🏪 Seller
- `POST /api/seller/login`
- `GET /api/seller/profile`

### 📦 Products
- `POST /api/products` (Add Product with multi-image upload)
- `GET /api/products` (Seller-specific listing with Pagination)
- `DELETE /api/products/:id` (Delete own product)
- `GET /api/products/:id/pdf` (Generate dynamic product catalog PDF)

## Folder Structure

```text
config/         - Database & Swagger configuration
controllers/    - MVC Controllers with asyncHandler
middleware/     - Auth, RBAC, and Error handling
models/         - Mongoose Schemas
routes/         - API Route definitions
services/       - Business logic (PDF generation)
utils/          - Reusable utilities (JWT, Pagination, Response, Async)
validations/    - Input validation schemas
uploads/        - Local storage for images and PDFs
```
