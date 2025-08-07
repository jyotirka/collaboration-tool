# Installation Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

## Backend Setup

1. Navigate to backend directory:
```bash
cd kb-platform/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/knowledge-base
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

4. Start the server:
```bash
npm start
# or for development
npx nodemon server.js
```

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd kb-platform/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Access the Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Dependencies

### Backend Dependencies
- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: Cross-origin resource sharing
- dotenv: Environment variables
- nodemailer: Email functionality
- crypto: Cryptographic functionality
- nodemon: Development server (dev dependency)

### Frontend Dependencies
- react: UI framework
- react-dom: React DOM renderer
- react-router-dom: Routing
- react-quill: Rich text editor
- axios: HTTP client
- react-scripts: Create React App scripts