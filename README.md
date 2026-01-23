# ToolNext Backend API

Backend service for the ToolNext project (tool rental platform). Built with **Node.js**, **Express**, **MongoDB (Mongoose)**, cookie-based sessions, file uploads, and documented with **Swagger (OpenAPI 3.0)**.

---

## Tech Stack

- **Node.js**, **Express**
- **MongoDB**, **Mongoose**
- **Auth:** cookie-based sessions (`sessionId`, `accessToken`, `refreshToken`)
- **Validation:** `celebrate` / `Joi`
- **Security:** `helmet`, `cors`, `cookie-parser`
- **Docs:** `swagger-ui-express`, `swagger-jsdoc`
- **Uploads:** `multer` + Cloudinary utils (`src/utils/*`)
- **Environment:** `dotenv`

---

## Features

- Authentication: register / login / logout / refresh session
- Users: current user, update profile, update avatar, get user by id
- Tools: CRUD, pagination, update image upload, full-text search index (name/description)
- Bookings: create booking with date overlap validation, list user bookings, get booking by id
- Feedbacks: create feedback, list feedbacks with pagination or limit, filter by tool
- Categories: list categories
- Swagger API documentation

---

## Project Structure

```text
src/
| server.js
|
+---constants
| time.js
|
+---controllers
| authController.js
| bookingsController.js
| categoriesController.js
| feedbacksController.js
| toolsController.js
| usersController.js
|
+---db
| connectMongoDB.js
|
+---docs
| swagger.js
|
+---middleware
| authenticate.js
| errorHandler.js
| logger.js
| multer.js
| notFoundHandler.js
|
+---models
| booking.js
| category.js
| feedback.js
| session.js
| tool.js
| user.js
|
+---routes
| authRoutes.js
| bookingsRoutes.js
| categoriesRoutes.js
| feedbacksRoutes.js
| toolsRoutes.js
| usersRoutes.js
|
+---services
| auth.js
|
+---utils
| deleteFromCloudinary.js
| saveFileToCloudinary.js
| uploadToCloudinary.js
|
\---validations
authValidation.js
bookingsValidation.js
feedbacksValidation.js
toolsValidation.js
usersValidation.js
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create .env file in project root:

```env
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/toolnext

# CORS
FRONTEND_DOMAIN=http://localhost:3001

# Cookie/session settings (example)
NODE_ENV=development
```

### 3) Run the server

- Development:

```bash
npm run dev
```

- Production:

```bash
npm start
```

Server will start on:

- `http://localhost:3000`

## API Documentation (Swagger)

Swagger UI available at:

- `http://localhost:3000/api-docs`

Swagger uses swagger-jsdoc to generate OpenAPI spec from JSDoc comments in `src/routes/*.js`.

## Authentication (Cookie-based)

This API uses HttpOnly cookies for authentication:

- `sessionId`
- `accessToken`
- `refreshToken`

## Notes

Cookies are not stored in LocalStorage.

In Chrome DevTools check:

- Application → Cookies → `http://localhost:3000`
- Network → Response Headers → Set-Cookie

For frontend requests (if different port/origin), include credentials:

- `fetch(..., { credentials: 'include' })`
- `axios.defaults.withCredentials = true`

## Main Endpoints

Base URL: `http://localhost:3000`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`

### Users

- `GET /users/current` (protected)
- `PATCH /users/current` (protected)
- `PATCH /users/current/avatar` (protected, multipart/form-data)
- `GET /users/:userId`
- `GET /users/:userId/tools`

### Tools

- `GET /tools` (pagination)
- `GET /tools/:toolId`
- `POST /tools` (protected)
- `PATCH /tools/:toolId` (protected)
- `PATCH /tools/:toolId/image` (protected, multipart/form-data)
- `DELETE /tools/:toolId` (protected)

### Bookings (protected)

- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:bookingId`

### Feedbacks

- `GET /feedbacks` (pagination / optional limit, optional toolId)
- `POST /feedbacks` (protected)

### Categories

- `GET /categories`

## Pagination

List endpoints typically support:

- page (default: 1)
- perPage (default: 10)

Example:

```http
GET /tools?page=1&perPage=10
```

Response format (example):

```json
{
  "page": 1,
  "perPage": 10,
  "totalItems": 57,
  "totalPages": 6,
  "tools": []
}
```

## Validation & Error Handling

- Request validation is handled via `celebrate` (Joi schemas).
- Standard middlewares:
  - `notFoundHandler`
  - `celebrate` errors handler: `errors()`
  - centralized `errorHandler`

Errors return JSON (example):

```json
{
  "message": "Validation error"
}
```

## Security

- `helmet()` for secure headers
- `cors()` with credentials: true and allowed origins
- cookies are set as HttpOnly (recommended)

## Scripts

package.json scripts:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

## Author

- Maryna Tkachenko

## Deployment (Render)

- API Base URL: `https://toolnext-solo-back.onrender.com`
- Swagger: `https://toolnext-solo-back.onrender.com/api-docs`
