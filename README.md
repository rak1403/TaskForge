# Koala Borator Backend 🚀

A RESTful API for collaborative project management, enabling teams to manage projects, tasks, subtasks, and notes with role-based access control.

---

## 📌 Overview

Koala Borator Backend provides a secure and scalable backend for managing team projects. It supports authentication, project organization, task tracking, and collaboration features.

---

## 👥 User Roles

- **Admin** – Full control over projects and members
- **Project Admin** – Manage tasks and project content
- **Member** – View projects and update task progress

---

## 🔑 Core Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Email verification
- Password reset & change
- Refresh tokens
- Role-based access control (RBAC)

### 📁 Project Management
- Create, update, delete projects
- View project details and members

### 👥 Team Management
- Add/remove members
- Assign roles within projects

### ✅ Task Management
- Create and assign tasks
- Update task status (Todo, In Progress, Done)
- Attach files to tasks

### 🧩 Subtasks
- Create and manage subtasks
- Members can mark completion

### 📝 Notes
- Admin-only note creation and management
- Accessible to all project members

### ❤️ Health Check
- API status endpoint

---

## 🛠️ API Structure

### Auth (`/api/v1/auth`)
- `POST /register`
- `POST /login`
- `POST /logout`
- `GET /current-user`
- `POST /change-password`
- `POST /refresh-token`
- `GET /verify-email/:token`
- `POST /forgot-password`
- `POST /reset-password/:token`

---

### Projects (`/api/v1/projects`)
- `GET /` – List projects
- `POST /` – Create project
- `GET /:projectId`
- `PUT /:projectId`
- `DELETE /:projectId`
- Member management endpoints

---

### Tasks (`/api/v1/tasks`)
- `GET /:projectId`
- `POST /:projectId`
- `GET /:projectId/t/:taskId`
- `PUT /:projectId/t/:taskId`
- `DELETE /:projectId/t/:taskId`
- Subtask endpoints

---

### Notes (`/api/v1/notes`)
- `GET /:projectId`
- `POST /:projectId`
- `GET /:projectId/n/:noteId`
- `PUT /:projectId/n/:noteId`
- `DELETE /:projectId/n/:noteId`

---

### Health Check
- `GET /api/v1/healthcheck`

---

## 🔐 Security

- JWT authentication with refresh tokens
- Role-based authorization middleware
- Input validation
- Secure file uploads
- Email verification & password reset

---

## 📂 File Uploads

- Multiple file attachments per task
- Stored in `public/images`
- Metadata tracking (URL, type, size)

---

## 📊 Data Models

### Roles
- `admin`
- `project_admin`
- `member`

### Task Status
- `todo`
- `in_progress`
- `done`

---

## 🎯 Success Criteria

- Secure authentication system
- Complete project lifecycle management
- Role-based access control
- Task & subtask hierarchy
- File attachment support

---

## ⚙️ Getting Started

```bash
# Install dependencies
npm install

# Run server
npm run dev