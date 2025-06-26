# 🎬 Movie Rental Application (MERN Stack)

This is a **MERN stack application** that lets customers rent movies. It provides full-featured RESTful APIs built with **Express.js** and **MongoDB (Mongoose)**. The app supports:
- User management (CRUD)
- Movies & Actors management
- Rental transactions
- Forgot password functionality
- Language & Genre management
- Admin dashboards and analytics
- JWT-based authentication and role-based authorization
- Redis caching for performance optimization

---

## 🧠 Features

- 🔐 JWT authentication and role-based authorization
- 🧑‍💼 User management (signup, login, profile updates)
- 🎥 Movie & Actor management (with file/image uploads via Multer)
- 📊 Dashboard statistics for admins
- 📄 Rentals tracking and payment management
- 📧 Forgot password handling
- ⚡ Redis cache for popular and frequently accessed data
- 🗣 Multi-language and genre support

---

## 🧠 Backend Architecture

The application contains the following models:

| Model             | Description                                      |
|------------------|--------------------------------------------------|
| **User**         | User authentication & profile management         |
| **Actor**        | Actor profiles with image upload                 |
| **Genre**        | Available movie genres                          |
| **Language**     | Available languages for movies                  |
| **Movie**        | Movie information with genres, actors, price, etc. |
| **Rental**       | Tracks rentals for customers                    |
| **ForgotPassword** | Handles forgot-password reset links            |

---

## 📂 Routes Overview

Here’s a summary of available routes and their required authorization.

### 🔐 Auth
| Method | Endpoint       | Description         | Auth     |
|--------|----------------|---------------------|---------|
| POST   | `/auth/`       | User login          | No auth  |

---

### 👥 Users
| Method | Endpoint       | Description                 | Auth          |
|--------|----------------|-----------------------------|---------------|
| POST   | `/users/`      | Create new user             | No auth       |
| GET    | `/users/`      | Get all users               | `admin`       |
| GET    | `/users/:id`   | Get single user detail      | `auth`        |
| PUT    | `/users/:id`   | Update user profile         | `auth`        |
| DELETE | `/users/:id`   | Delete a user               | `admin`       |

---

### 🎥 Movies
| Method | Endpoint           | Description               | Auth         |
|--------|--------------------|---------------------------|------------|
| POST   | `/movies/`         | Create new movie         | No auth      |
| GET    | `/movies/`         | Get all movies (cached)  | No auth      |
| GET    | `/movies/popular`  | Get most popular movies  | No auth      |
| GET    | `/movies/newReleased` | Get new releases    | No auth      |
| GET    | `/movies/getRandom`| Get a random movie       | No auth      |
| GET    | `/movies/:id`      | Get one movie detail     | No auth      |
| PUT    | `/movies/:id`      | Update movie             | No auth      |
| DELETE | `/movies/:id`      | Delete movie             | No auth      |

---

### 🎭 Actors
| Method | Endpoint       | Description                 | Auth          |
|--------|----------------|-----------------------------|------------|
| POST   | `/actors/`    | Create actor                 | No auth      |
| GET    | `/actors/`    | Get all actors               | `admin`      |
| PUT    | `/actors/:id` | Update actor                 | No auth      |
| DELETE | `/actors/:id` | Delete actor                 | `admin`      |

---

### 🎬 Rentals
| Method | Endpoint       | Description             | Auth       |
|--------|----------------|-------------------------|------------|
| POST   | `/rentals/`   | Create new rental       | No auth     |
| GET    | `/rentals/`   | Get all rentals        | No auth     |
| GET    | `/rentals/:id`| Get one rental detail  | No auth     |
| PUT    | `/rentals/`   | Update rental          | No auth     |

---

### 🏷 Genres
| Method | Endpoint       | Description             | Auth       |
|--------|----------------|-------------------------|------------|
| POST   | `/genres/`    | Create new genre        | `admin`    |
| GET    | `/genres/`    | Get all genres          | No auth    |
| GET    | `/genres/:id` | Get one genre           | No auth    |
| PUT    | `/genres/:id` | Update genre            | `admin`    |
| DELETE | `/genres/:id` | Delete genre            | `admin`    |

---

### 🌍 Languages
| Method | Endpoint         | Description             | Auth       |
|--------|------------------|-------------------------|------------|
| POST   | `/languages/`   | Create new language     | `admin`    |
| GET    | `/languages/`   | Get all languages       | No auth    |
| GET    | `/languages/:id`| Get one language        | No auth    |
| PUT    | `/languages/:id`| Update language         | `admin`    |
| DELETE | `/languages/:id`| Delete language         | `admin`    |

---

### 🧮 Dashboard (Admin Only)
| Method | Endpoint                  | Description                                |
|--------|----------------------------|--------------------------------------------|
| GET    | `/dashboard/getPieChartData`  | Get data for pie chart                    |
| GET    | `/dashboard/getBarChartData/:count` | Get data for bar chart             |
| GET    | `/dashboard/getMoviesByReleaseDate`| Get movies by release date           |
| GET    | `/dashboard/getHighestPurchasedUsers/:count` | Get top purchasing users     |

---

### 🔐 Forgot Password
| Method | Endpoint                | Description                                 |
|--------|-------------------------|---------------------------------------------|
| POST   | `/forgotPassword/`      | Create forgot-password request              |
| POST   | `/forgotPassword/:email`| Reset password by email                    |
| GET    | `/forgotPassword/`      | Get all forgot-password requests            |

---

## 🧪 Technologies Used
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **Authentication**: JWT
- **File uploads**: Multer
- **Cache**: Redis
- **Frontend (planned)**: React.js
- **Styling**: Tailwind CSS (planned for frontend)

---

## 🛠 Getting Started

### 📋 Prerequisites
- MongoDB instance
- Redis setup
- Node.js and npm installed

### 🔧 Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/movie-rental-mern.git
   cd movie-rental-mern
