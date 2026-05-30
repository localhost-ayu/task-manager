# Task Manager

A full-stack task management application built with Laravel and React.

## Features

### Authentication

* User registration
* User login
* Protected routes
* Token-based authentication with Sanctum
* Logout functionality

### Task Management

* Create tasks
* Edit tasks
* Delete tasks
* View all tasks
* Task descriptions
* Due dates
* Task priorities (Low, Medium, High)
* Task statuses (Pending, In Progress, Completed)

### Dashboard

* Task statistics overview
* Search tasks by title
* Filter by status
* Filter by priority
* Overdue task indicators
* Responsive design

![Login](screenshots/login.png)
![Register](screenshots/register.png)
![Dashboard](screenshots/dashboard.png)

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

## Project Structure

task-manager/

├── task-manager-api/

└── task-manager-frontend/

## Installation

### Backend

```bash
cd task-manager-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd task-manager-frontend
npm install
npm run dev
```

## Future Improvements

* Task categories
* User profile management
* Dark mode
* Pagination
* Drag and drop task organization
* Notifications

## Author
Nathã Grazzioli Botelho.
Developed as a full-stack portfolio project using Laravel and React.



