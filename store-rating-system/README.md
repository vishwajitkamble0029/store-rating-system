# 🏪 Store Rating Management System

A full-stack web application developed as part of the **Roxiler Systems – Full Stack Intern Coding Challenge**. The application allows users to submit ratings for stores while providing role-based access for **System Administrators**, **Store Owners**, and **Normal Users**.

---

## 📌 Assignment Objective

Develop a secure and scalable web application where users can register, log in, browse stores, and submit ratings. The application includes role-based dashboards, authentication, store management, and rating management following industry best practices.

---

# 🚀 Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Context API
* CSS / Bootstrap (or your UI library)

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* Express Validator

### Database

* MySQL
* Sequelize ORM

---

# ✨ Features

## 🔐 Authentication

* User Registration
* Secure Login using JWT
* Password Encryption using bcrypt
* Change Password
* Protected Routes
* Role-Based Authorization

---

## 👨‍💼 System Administrator

* Dashboard with:

  * Total Users
  * Total Stores
  * Total Ratings
* Add New Users
* Add New Stores
* View All Users
* View All Stores
* Search Users
* Search Stores
* Sort Tables
* View User Details
* Logout

---

## 👤 Normal User

* User Registration
* Login
* Change Password
* Browse All Stores
* Search Stores
* View Overall Store Ratings
* Submit Rating (1–5)
* Update Submitted Rating
* Logout

---

## 🏬 Store Owner

* Login
* Change Password
* Dashboard
* View Average Rating
* View Users Who Rated Their Store
* Logout

---

# ✅ Form Validation

The application follows all validation rules specified in the assessment.

| Field    | Validation                                                   |
| -------- | ------------------------------------------------------------ |
| Name     | 20–60 Characters                                             |
| Address  | Maximum 400 Characters                                       |
| Email    | Valid Email Format                                           |
| Password | 8–16 Characters, One Uppercase Letter, One Special Character |

---

# 📂 Project Structure

```text
store-rating-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── validators/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── store_rating_db.sql
├── README.md
└── .gitignore


---

# ⚙️ Installation

## 1. Clone Repository 

git clone <your-github-repository-url>
cd store-rating-system


---

## 2. Backend Setup


cd backend
npm install


Create a `.env` file using `.env.example`.

Example:
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_secret_key

DEFAULT_ADMIN_NAME=System Administrator Account User
DEFAULT_ADMIN_EMAIL=admin@storerating.com
DEFAULT_ADMIN_PASSWORD=Admin@1234


Start the backend: npm run dev

---

## 3. Frontend Setup


cd frontend
npm install


Create `.env`: VITE_API_URL=http://localhost:5000/api


Start the frontend: npm run dev


---

# 🗄️ Database Setup

Create a MySQL database: CREATE DATABASE store_rating_db;

Import the provided SQL file: text store_rating_db.sql
Alternatively, if using the provided seed script: bash npm run seed


This creates the required tables and sample data.

---

# 🔑 Default Login Credentials

### System Administrator

Email: admin@storerating.com

Password: Admin@1234


---

### Store Owner

Email: owner1@storerating.com

Password: Owner@1234


---

### Normal User

Email: user1@storerating.com

Password: User@1234


---

# 🌐 Application URLs

Frontend : http://localhost:5173

Backend: http://localhost:5000/api


---

# 📊 Database Design

The application uses three primary tables:

* Users
* Stores
* Ratings

Relationships:

* One Store Owner → Multiple Stores
* One User → Multiple Ratings
* One Store → Multiple Ratings
* One User can rate a Store only once

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Role-Based Access Control (RBAC)
* Protected API Routes
* Input Validation
* Environment Variable Configuration
* Secure Password Storage

---

# 📋 Assignment Requirements Covered

* ✅ Role-Based Authentication
* ✅ System Administrator Module
* ✅ Normal User Module
* ✅ Store Owner Module
* ✅ Store Rating System
* ✅ Search Functionality
* ✅ Sorting Functionality
* ✅ Dashboard Statistics
* ✅ Form Validation
* ✅ MySQL Database
* ✅ JWT Authentication
* ✅ Secure Password Encryption
* ✅ Responsive User Interface

---

# 👨‍💻 Developed By

**Vishwajit Kamble**

Submitted as part of the **Roxiler Systems – MERN Stack Developer Intern Online Assessment**.
