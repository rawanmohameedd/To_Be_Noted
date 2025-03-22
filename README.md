# Task Management API – Assessment  

## Overview  
This project is a **Task Management API** built with **TypeScript, Express.js, and MongoDB**, implementing **JWT authentication, role-based access control (RBAC), caching, background processing, and cloud deployment on Vercel**.  

## Features  

### 1. **Advanced API Development & Security**  
- **Task Management Endpoints**  
  - `POST /tasks` → Create a new task  
  - `GET /tasks/{id}` → Get task details  
  - `PUT /tasks/{id}` → Update task  
  - `DELETE /tasks/{id}` → Delete task  
  - `GET /tasks/user/{userId}` → Get all tasks assigned to a user (pagination & filtering)  
- **Authentication & Security**  
  - JWT-based authentication with **refresh tokens**  
  - **Role-based access control (RBAC)**: Admin, Manager, User  
  - **Rate-limiting** and **input sanitization**  
  - Request validation using **Zod**  

### 2. **MongoDB Database Design & Query Optimization**  
- **Database Collections**  
  - `users` → Stores user details and roles  
  - `tasks` → Stores task details  
  - `task_history` → Tracks task status changes (audit logging)  
  - `task_comments` → Stores user comments on tasks  
  - `notifications` → Handles task-related notifications  
  - `user_tasks` → Manages many-to-many user-task assignments  
- **Optimized Queries**  
  - Retrieve **all tasks assigned** to a user (paginated, filterable)  
  - Retrieve **task history** (status changes, comments, notifications)  
  - Retrieve **users who interacted** with a specific task  
- **Performance Enhancements**  
  - Indexing and **aggregation pipelines** for optimized queries  

### 3. **Caching & Performance Optimization**  
- **Redis Integration** for caching API responses  
- Caching for `GET /tasks/user/{userId}`, with **automatic cache invalidation** on updates  
- **BullMQ for background jobs**, including task update notifications  

### 4. **Cloud Deployment**  
- **Deployment on Vercel**  
- **Dockerized setup** for scalability  
- **CI/CD pipeline** with GitHub Actions  
- **MongoDB Atlas** as a managed cloud database  
- **Redis** for caching performance  
- **Event-driven architecture** with Kafka or RabbitMQ  

## Try It Yourself  
👉 **API Documentation**: [Task Management API Docs](https://to-be-noted.vercel.app/api-docs/)  
