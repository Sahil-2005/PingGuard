# 🛡️ PingGuard

PingGuard is a modern, full-stack uptime monitoring and alerting application. It allows you to continuously track the availability and latency of your web services, APIs, and websites. 

Built with a robust Spring Boot backend, time-series optimized database, and a highly responsive React frontend, PingGuard provides a seamless and visually stunning way to keep your systems in check.

---

## ✨ Features

- **Reliable Uptime Monitoring**: Schedule and execute regular health checks for URLs and APIs.
- **Time-Series Analytics**: Fast and efficient storage of ping latency and uptime data leveraging TimescaleDB.
- **Dynamic Dashboard**: A sleek, interactive UI built with React, Vite, and Framer Motion for micro-animations.
- **Secure Authentication**: Robust user authentication backed by Spring Security and JWT.
- **Background Scheduling**: Highly reliable background task scheduling using Quartz.

---

## 📂 Directory Structure

```text
PingGuard/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/                    # Frontend source code
│   ├── package.json            # Client dependencies
│   ├── vite.config.js          # Vite configuration
│   └── eslint.config.js        # Linter configuration
├── server/                     # Spring Boot Backend
│   ├── src/main/java/pingguard/
│   │   ├── config/             # App & Security configurations
│   │   ├── controller/         # REST API endpoints
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA Entities
│   │   ├── job/                # Quartz Scheduling Jobs
│   │   ├── mapper/             # Object mapping
│   │   ├── repository/         # Database repositories
│   │   ├── security/           # JWT Authentication logic
│   │   └── service/            # Business logic layer
│   ├── pom.xml                 # Maven dependencies
│   └── mvnw                    # Maven wrapper
├── docker-compose.yml          # TimescaleDB & infrastructure setup
└── README.md                   # Project documentation
```

---

## 🛠️ Tech Stack

### Frontend (Client)
- **[React 19](https://react.dev/) & [Vite](https://vitejs.dev/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** for utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** for fluid animations
- **[React Query](https://tanstack.com/query)** for data fetching and caching
- **[Zustand](https://zustand-demo.pmnd.rs/)** for state management

### Backend (Server)
- **Java 19 & [Spring Boot 3.5](https://spring.io/projects/spring-boot)**
- **Spring Data JPA & Spring Security**
- **[Quartz Scheduler](https://www.quartz-scheduler.org/)** for job scheduling
- **JWT (jjwt)** for secure stateless authentication

### Database & Infrastructure
- **[TimescaleDB](https://www.timescale.com/) (PostgreSQL 16)**: Optimized specifically for time-series data storage.
- **Docker & Docker Compose**: For rapid, localized infrastructure setup.

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
- Node.js (v18+)
- Java (v19+)
- Maven
- Docker & Docker Compose

### 1. Start the Database
PingGuard requires a PostgreSQL/TimescaleDB instance. Start it up effortlessly using Docker Compose from the project root:

```bash
docker-compose up -d
```

### 2. Start the Backend Server
Navigate to the server directory and run the Spring Boot application using Maven wrapper:

```bash
cd server
./mvnw spring-boot:run
```

### 3. Start the Frontend Client
Navigate to the client directory, install all required dependencies, and boot up the development server:

```bash
cd client
npm install
npm run dev
```

---

## 👨‍💻 Author

**Sahil Gawade**

You can reach out or check out my work through the following platforms:

<p align="left">
  <a href="https://github.com/Sahil-2005" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/sahil-gawade-920a0a242/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="mailto:gawadesahil.dev@gmail.com" target="_blank">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  </a>
  <a href="https://leetcode.com/u/sahilgawade4321/" target="_blank">
    <img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=LeetCode&logoColor=black" alt="LeetCode" />
  </a>
  <a href="https://sahil-gawade.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-252F3F?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
  </a>
</p>

If you like this project, feel free to star it! ⭐
