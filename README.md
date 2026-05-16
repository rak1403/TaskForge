# TaskForge 🚀

**TaskForge** is a modern, collaborative project management platform designed for efficiency and elegance. It features a robust Node.js backend and a polished React frontend with a focus on modern aesthetics and seamless user workflows.

## ✨ Features

### 🔐 Authentication & Security
- **Secure Login & Registration**: Modern UI with JWT-based authentication.
- **Password Recovery**: Complete "Forgot Password" and "Reset Password" utilities.
- **Refresh Token Logic**: Seamless session persistence using HTTP-only cookies.

### 📁 Project Management
- **Workspaces**: Create and manage multiple projects with distinct members.
- **Role-Based Access**: Specialized permissions for **Admin**, **Project Admin**, and **Members**.

### 👥 Collaboration
- **Team Management**: Invite members via email and assign specific roles.
- **Task Hierarchy**: Tasks with descriptions, assignees, and nested subtasks.
- **Project Notes**: Shared notes for project-level documentation and quick references.

## 🛠️ Tech Stack

### Frontend
- **React 19 + Vite**
- **Redux Toolkit** (State Management)
- **Lucide React** (Modern Icons)
- **Framer Motion** (Smooth Animations)
- **Axios** (API Communication)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose**
- **Nodemailer & Mailtrap** (Email Services)
- **JWT** (Authentication)

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (local or Atlas)
- Mailtrap account (for testing emails)

### 1. Setup Backend
```bash
# From the root directory
npm install
```
Create a `.env` file in the root:
```env
PORT=8000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
MAILTRAP_SMTP_USER=your_user
MAILTRAP_SMTP_PASS=your_pass
```
Run the backend:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```
Run the frontend:
```bash
npm run dev
```

---
