# 🔥 InsightVault

A full-stack personal finance intelligence platform for structured data management and interactive visual analytics.

## 📌 Project Overview

InsightVault transforms raw financial data into meaningful insights through a robust client-server architecture. Instead of just storing transactions, the platform structures financial data, aggregates totals using complex backend queries, and converts the results into real-time visual representations. [cite_start]It solves the problem of basic expense tracking by providing a highly scalable, multi-user environment where users can filter large datasets, analyze spending trends over time, and manage targeted savings goals—all through a seamlessly responsive dashboard[cite: 4].

## 🎯 Objective / Motivation

While modern frameworks are powerful, they often abstract away the foundational mechanics of the web. [cite_start]InsightVault was built with a "fundamentals-first" approach to deeply understand system design and the complete Request-Response lifecycle[cite: 4].

- [cite_start]**Mastering the Fundamentals**: Learning to manage the Document Object Model (DOM), event-driven rendering, and complex CSS layout engines (Grid/Flexbox) without relying on heavy frontend abstractions like React[cite: 4].
- [cite_start]**System Design & Communication**: Replicating enterprise-grade backend communication by creating an API-driven environment that handles state, data aggregation, and persistent relational storage[cite: 4].
- [cite_start]**Data Integrity & Architecture**: Building a clean, decoupled architecture where a modular frontend communicates strictly via a RESTful Node.js API to a SQL database[cite: 4].

## ⚙️ Features

### 1. Transaction Management & Advanced Filtering
- [cite_start]**Full CRUD Lifecycle**: Seamlessly add, view, update, and delete financial records[cite: 1].
- [cite_start]**Granular Filtering Engine**: A multi-dimensional system allowing users to isolate data by categories (e.g., Rent, Salary, Food), transaction types, or keyword searches[cite: 1].
- [cite_start]**Temporal Intelligence**: Built-in date range selectors (This Week, This Month, Custom) for period-over-period financial analysis[cite: 1].
- [cite_start]**Enterprise-Ready Pagination**: Transactions are served via a backend pagination engine, keeping the UI snappy even with thousands of records by loading only a specific subset of data at any time[cite: 2].

### 2. Reports & Analytics Engine
- [cite_start]**Distribution Visualization**: Uses backend `GROUP BY` and `SUM` SQL aggregations to generate dynamic pie charts that visualize spending concentration[cite: 2].
- **Trend Analysis**: Visualizes income vs. expense trends over time. [cite_start]Missing values are normalized to 0 to ensure chart continuity[cite: 4].
- **Interactive Syncing**: The reporting layer is fully integrated with the filtering engine. [cite_start]Adjusting a filter triggers an immediate re-fetch and re-render of charts[cite: 2].

### 3. Frontend Architecture & UI Logic
- [cite_start]**Modular Frontend**: Built with ES6 modules to ensure deterministic rendering and prevent global scope pollution[cite: 1].
- **Memory-Safe Visuals**: Built with Chart.js. [cite_start]To prevent memory leaks, every chart follows a strict lifecycle: fetch data -> transform -> destroy previous instance -> initialize new chart[cite: 4].
- [cite_start]**Defensive Engineering**: Robust error handling ensures the UI remains stable during API failures or empty database results[cite: 2].

### 4. Wishlist System (Savings Goals)
- [cite_start]**Goal Tracking**: Set targets for future purchases or savings milestones[cite: 1].
- [cite_start]**Interactive Progress UI**: High-visibility progress bars and goal cards provide immediate visual gratification as users move closer to their targets[cite: 2].

## 🏗️ System Architecture & Data Flow

[cite_start]InsightVault utilizes a modern, decoupled guest-server architecture designed for scalability and deployment flexibility[cite: 4].

`Client (Vercel)` ➔ `API (Node/Express)` ➔ `Database (Turso/SQLite)`

### The Request Lifecycle
1. [cite_start]**Event Capture**: The JavaScript event listener captures user input and packages the filter parameters into a URL query string[cite: 2].
2. [cite_start]**Asynchronous Fetch**: An `async/await` fetch call is dispatched to the Express.js backend[cite: 2].
3. [cite_start]**API Routing**: The Express router identifies the endpoint and passes the parameters to the designated Controller[cite: 2].
4. [cite_start]**SQL Execution**: The Controller builds a dynamic SQL query, utilizing the database engine to perform sorting, filtering, and aggregating[cite: 2].
5. [cite_start]**JSON Response**: The backend returns a structured JSON object containing the results and metadata (like total count for pagination)[cite: 2].
6. [cite_start]**DOM Update**: The frontend receives the data, clears existing UI elements, and maps the new data into the DOM[cite: 2].

### 🔌 RESTful API Documentation

| Endpoint | Method | Params/Query | Description |
| :--- | :---: | :--- | :--- |
| `/api/transactions` | `GET` | `page`, `limit`, `category`, `type`, `search`, `startDate`, `endDate` | [cite_start]Returns paginated transactions based on active filters[cite: 1]. |
| `/api/transactions` | `POST` | JSON Body | [cite_start]Validates and creates a new transaction record[cite: 1]. |
| `/api/reports/totals` | `GET` | `startDate`, `endDate` | [cite_start]Aggregates income/expense totals for dashboard metrics[cite: 1]. |
| `/api/reports/categories` | `GET` | `type`, `startDate`, `endDate` | [cite_start]Provides grouped data for pie chart visualization[cite: 1]. |
| `/api/wishlist` | `GET` | - | [cite_start]Retrieves savings goals and computed progress[cite: 1]. |

## 🛠️ Tech Stack

- [cite_start]**Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript (ES6+), Bootstrap 5, Chart.js[cite: 1].
- [cite_start]**Backend**: Node.js, Express.js[cite: 1].
- [cite_start]**Database**: SQLite3 (Dev), Turso/libSQL (Prod)[cite: 1].
- [cite_start]**Hosting**: Vercel (Frontend), Turso (Managed Database)[cite: 1].

## 🧠 Key Design Decisions

### 1. The "Vanilla+" Choice (Why No React?)
I chose to avoid frameworks to ensure my skills were built on a solid foundation. By building the "React way" (component-based thinking) but using Vanilla tools, I gained a deeper appreciation for state management, re-rendering logic, and optimized DOM updates. [cite_start]This demonstrates an understanding of the technology the tools are built upon, not just the tools themselves[cite: 2].

### 2. Strategic Pivot to SQLite (Portability)
I opted for SQLite3 for its exceptional portability. The database is a single file within the project, meaning reviewers can clone the repo and run it instantly without complex DB setups. [cite_start]This file-based approach also made the migration to Turso (Cloud SQLite) seamless for production readiness[cite: 2].

### 3. Computation Offloading (Backend-First)
I made a conscious architectural decision to perform all data "heavy lifting" on the backend. By using SQL for grouping and summing data, I keep the frontend lightweight. [cite_start]This ensures the app remains fast even on lower-end mobile devices, as the client only renders final results[cite: 2].

## 🚧 Project Status

[cite_start]This project is currently in **Active Development (Beta)**[cite: 1].

- [cite_start]**Working**: Full-stack loop, API routing, database persistence, SQL aggregation logic, analytics dashboard, and core filtering engine.
- [cite_start]**Fine-Tuning**: Polishing mobile responsiveness for complex tables and finalizing UI error boundaries for the wishlist system[cite: 1].

## 🔮 Future Improvements

- [cite_start]**Authentication & Security**: Implementing JWT-based user authentication to allow multiple private user profiles[cite: 1].
- [cite_start]**Predictive Analytics**: Developing a backend service that uses historical data to predict future spending patterns[cite: 1].
- [cite_start]**Data Export**: Adding functionality to export financial summaries as PDF or CSV files for external record-keeping[cite: 1].

## ▶️ Setup Instructions

1. **Clone the repository:** ```bash
   git clone [https://github.com/Griffinn/InsightVault-demo.git](https://github.com/Griffinn/InsightVault-demo.git)
   cd InsightVault-demo
2. **Install Backend Dependencies:**
