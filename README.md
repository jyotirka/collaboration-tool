# Knowledge Base Platform

A modern, collaborative knowledge base platform built with React and Node.js. Create, manage, and share documents with real-time collaboration features including @mentions and notifications.

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Password reset functionality
- Username-based user identification

### 📝 Document Management
- Create, edit, and delete documents
- Rich text editor with ReactQuill (formatting, links, images)
- Public/Private document visibility with granular access control
- Real-time document search by title and content
- Image upload with automatic compression

### 🤝 Collaboration
- **@username mentions** with instant dropdown search
- Mentioned users get notifications and view access to private documents
- Real-time notifications system with read/unread status
- User search and autocomplete for mentions

### 🎨 Modern UI/UX
- Beautiful gradient design with glass-morphism effects
- Responsive design for all devices
- Smooth animations and transitions
- Professional card-based layouts

## 🚀 Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **ReactQuill** - Rich text editor
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email functionality

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Clone the Repository
```bash
git clone https://github.com/yourusername/knowledge-base-platform.git
cd knowledge-base-platform
```

### Backend Setup
```bash
cd kb-platform/backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/knowledge-base
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Start the backend server:
```bash
npx nodemon server.js
```

### Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🎯 Usage

### Getting Started
1. **Register** a new account with email and username
2. **Login** to access your dashboard
3. **Create** your first document
4. **Mention** other users with @username
5. **Collaborate** and receive notifications

### Key Features
- **Search Documents**: Use the search bar to find documents by title or content
- **Mention Users**: Type @username to see dropdown, mentioned users get view access
- **Notifications**: Click the notification bell to see mentions and updates
- **Privacy Controls**: Manage document permissions with viewers and editors
- **Share Links**: Generate shareable URLs for public documents only
- **Rich Editing**: Use the toolbar for formatting, links, images, and more

## 📁 Project Structure

```
frigga cloud/
├── kb-platform/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── documentController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Document.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── document.js
│   │   │   └── notifications.js
│   │   ├── .env
│   │   ├── package.json
│   │   └── server.js
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── CreateDocument.js
│       │   │   ├── DocumentList.js
│       │   │   ├── Editor.js
│       │   │   ├── Notifications.js
│       │   │   ├── PrivacySettings.js
│       │   │   ├── SharedDocument.js
│       │   │   └── ProtectedRoute.js
│       │   ├── pages/
│       │   │   ├── Login.js
│       │   │   └── Register.js
│       │   ├── App.css
│       │   ├── App.js
│       │   └── index.js
│       └── package.json
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Documents
- `GET /api/documents` - Get user documents
- `POST /api/documents` - Create new document
- `GET /api/documents/:id` - Get single document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/search` - Search documents
- `GET /api/documents/users/search` - Search users for mentions
- `PUT /api/documents/:id/permissions` - Update document permissions
- `POST /api/documents/:id/share` - Generate share link (public docs only)
- `GET /api/documents/shared/:shareLink` - Access document via share link

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
### This is how the application looks like 
<img width="1000" height="600" alt="Screenshot 2025-07-29 123019" src="https://github.com/user-attachments/assets/69e9cb7e-0c1d-4483-90e3-249a2dc3474a" />


<img width="1000" height="346" alt="Screenshot 2025-07-29 122940" src="https://github.com/user-attachments/assets/298f6701-1f59-4d75-8d19-528c55e90510" />


<img width="952" height="727" alt="Screenshot 2025-07-29 115715" src="https://github.com/user-attachments/assets/2462c459-5b6f-4cae-bdfe-28b7b205b03c" />


<img width="1000" height="577" alt="Screenshot 2025-07-29 115706" src="https://github.com/user-attachments/assets/3ba25421-6b4d-4895-836f-6e95edbf096c" />


<img width="1000" height="600" alt="Screenshot 2025-07-29 115845" src="https://github.com/user-attachments/assets/f79cce17-11e4-433a-8c29-ddd2b55a08fe" />

<img width="1396" height="929" alt="Screenshot 2025-07-29 130110" src="https://github.com/user-attachments/assets/cc166de8-fa6d-482e-8135-1230b10fc361" />

<img width="696" height="636" alt="Screenshot 2025-07-29 115730" src="https://github.com/user-attachments/assets/c480ed12-a026-4366-9d7b-9fcbf5dd8dbd" />


<img width="777" height="718" alt="Screenshot 2025-07-29 115722" src="https://github.com/user-attachments/assets/0957d00d-e94b-4f57-aedb-03757ec57776" />


  

