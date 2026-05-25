# 🛡️ PingGuard: Enterprise Uptime Monitoring SaaS

<p align="center">
  <a href="https://ping-guard-up.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-PingGuard%20SaaS-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

PingGuard is a modern, full-stack, enterprise-grade uptime monitoring and alerting application. It continuously tracks the availability and latency of your web services, APIs, and websites, offering deep analytics and instant incident alerts.

Built with a highly scalable Spring Boot backend, a time-series optimized database (TimescaleDB), and a visually stunning React frontend utilizing strict **Neubrutalism** design principles.

---

## ✨ Key Features

- **Reliable Uptime Monitoring**: Schedule and execute precise, high-frequency health checks using **Quartz Scheduler**.
- **Advanced Time-Series Analytics**: Fast and efficient storage of ping latency and uptime data leveraging **TimescaleDB** (Hypertables & Continuous Aggregates).
- **Incident Alerting**: Event-driven, asynchronous email alerting system (via **Mailtrap**) that notifies you the moment a monitor goes DOWN, and when it recovers.
- **Dynamic Dashboard**: A sleek, interactive, and responsive UI built with **React 19**, **Vite**, and **Tailwind CSS v4** featuring a distinctive Neubrutalism design.
- **Secure Authentication**: Robust user authentication backed by **Spring Security** and stateless **JWT** tokens.
- **Database Migrations**: Automated, version-controlled schema migrations powered by **Flyway**.
- **Production Ready**: Fully configured for production deployment using platforms like **Render** (Backend/Frontend) and **Aiven** (Managed TimescaleDB).

---

## 🛠️ Tech Stack

### Frontend (Client)
- **[React 19](https://react.dev/) & [Vite](https://vitejs.dev/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** for utility-first styling (Neubrutalism aesthetics)
- **[Recharts](https://recharts.org/)** for gorgeous data visualizations (Latency & Uptime)
- **[Lucide React](https://lucide.dev/)** for crisp iconography
- **[React Query](https://tanstack.com/query)** for efficient data fetching and caching
- **[Zustand](https://zustand-demo.pmnd.rs/)** for lightweight state management
- **[Framer Motion](https://www.framer.com/motion/)** for fluid micro-animations

### Backend (Server)
- **Java 19 & [Spring Boot 3.5](https://spring.io/projects/spring-boot)**
- **Spring Data JPA & Spring Security**
- **[Flyway](https://flywaydb.org/)** for reliable database migrations
- **[Quartz Scheduler](https://www.quartz-scheduler.org/)** (JDBC JobStore) for clustered, persistent background scheduling
- **JWT (jjwt)** for secure stateless authentication
- **Spring Boot Mail** for asynchronous event-driven email notifications

### Database & Infrastructure
- **[TimescaleDB](https://www.timescale.com/) (PostgreSQL 16)**: Optimized specifically for time-series data storage using Hypertables.
- **Docker & Docker Compose**: For rapid, localized infrastructure setup.

---

## 📂 Directory Structure

```text
PingGuard/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/                    # Frontend source code
│   │   ├── api/                # Axios API client setup
│   │   ├── components/         # Reusable UI components (Analytics, Auth, Dashboard)
│   │   ├── hooks/              # Custom React Query & logic hooks
│   │   ├── pages/              # Page components (Dashboard, MonitorDetails, Auth)
│   │   └── store/              # Zustand global state stores
│   ├── package.json            # Client dependencies
│   ├── vite.config.js          # Vite configuration
│   └── eslint.config.js        # Linter configuration
├── server/                     # Spring Boot Backend
│   ├── src/main/
│   │   ├── java/pingguard/
│   │   │   ├── config/         # App, Security, & CORS configurations
│   │   │   ├── controller/     # REST API endpoints
│   │   │   ├── dto/            # Data Transfer Objects (Requests/Responses)
│   │   │   ├── entity/         # JPA Entities
│   │   │   ├── event/          # Custom Application Events (e.g., Status Changed)
│   │   │   ├── job/            # Quartz Scheduling Jobs
│   │   │   ├── mapper/         # Object mapping
│   │   │   ├── repository/     # Database repositories & Native SQL Projections
│   │   │   ├── security/       # JWT Authentication logic
│   │   │   └── service/        # Business logic layer (Ping, Analytics, Alerts)
│   │   └── resources/
│   │       ├── db/migration/   # Flyway SQL migration scripts (V1 to V5)
│   │       └── application.yml # Core configuration (DB, Mail, Quartz, JWT)
│   ├── pom.xml                 # Maven dependencies
│   ├── Dockerfile              # Multi-stage Docker build for production
│   └── mvnw                    # Maven wrapper
├── docker-compose.yml          # TimescaleDB local infrastructure setup
└── README.md                   # Project documentation
```

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
Navigate to the server directory and run the Spring Boot application using the Maven wrapper:

```bash
cd server
./mvnw spring-boot:run
```
*(Note: Flyway will automatically execute all database migrations, including creating the TimescaleDB hypertable and Quartz scheduler tables, on startup.)*

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
