# Task Manager

A full-stack task management application built with Laravel and React, allowing users to create, organize, and track tasks through an intuitive dashboard.

---

## Features

### Authentication

* User registration
* User login
* Protected routes
* Token-based authentication with Laravel Sanctum
* Logout functionality

### Task Management

* Create tasks
* Edit tasks
* Delete tasks
* View all tasks
* Task descriptions
* Due dates
* Task priorities (Low, Medium, High)
* Task statuses:

  * Pending
  * In Progress
  * Completed

### Dashboard

* Task statistics overview
* Search tasks by title
* Filter tasks by status
* Filter tasks by priority
* Overdue task indicators
* Responsive design

---

## Screenshots

### Login

![Login](./screenshots/login.png)

### Register

![Register](./screenshots/register.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

---

## Tech Stack

### Backend

* Laravel
* Laravel Sanctum
* MySQL

### Frontend

* React
* Vite
* Axios
* React Context API

---

## Project Structure

```text
task-manager/
│
├── task-manager-api/
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
│
└── task-manager-frontend/
    ├── src/
    ├── public/
    └── ...
```

---

## Installation

### Backend Setup

```bash
cd task-manager-api

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

### Frontend Setup

```bash
cd task-manager-frontend

npm install

npm run dev
```

---

## Future Improvements

* Task categories
* User profile management
* Dark mode
* Pagination
* Drag-and-drop task organization
* Notifications

---

## What I Learned

This project was built to practice and improve skills in:

* Laravel API development
* Laravel Sanctum authentication
* React Context API
* Protected routes
* CRUD operations
* RESTful API integration
* Axios requests
* MySQL database management
* Full-stack application architecture

---

## Author

**Nathã Grazzioli Botelho**

Developed as a full-stack portfolio project using Laravel and React.
