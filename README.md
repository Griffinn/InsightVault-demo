# InsightVault

A full-stack personal finance intelligence platform for structured data management and interactive visual analytics.

## Project Overview

InsightVault transforms raw financial data into meaningful insights through a robust client-server architecture. Instead of just storing transactions, the platform structures financial data, aggregates totals using complex backend queries, and converts the results into real-time visual representations. It solves the problem of basic expense tracking by providing a highly scalable, multi-user environment where users can filter large datasets, analyze spending trends over time, and manage targeted savings goals—all through a seamlessly responsive dashboard.

## Objective / Motivation

While modern frameworks are powerful, they often abstract away the foundational mechanics of the web. InsightVault was built with a "fundamentals-first" approach to deeply understand system design and the complete Request-Response lifecycle.

* **Mastering the Fundamentals:** Learning to manage the Document Object Model (DOM), event-driven rendering, and complex CSS layout engines (Grid/Flexbox) without relying on heavy frontend abstractions like React.
* **System Design & Communication:** Replicating enterprise-grade backend communication by creating an API-driven environment that handles state, data aggregation, and persistent relational storage.
* **Data Integrity & Architecture:** Building a clean, decoupled architecture where a modular frontend communicates strictly via a RESTful Node.js API to a SQL database.

## Features

### 1. Transaction Management & Advanced Filtering
* **Full CRUD Lifecycle:** Seamlessly add, view, update, and delete financial records.
* **Granular Filtering Engine:** A multi-dimensional system allowing users to isolate data by categories (e.g., Rent, Salary, Food), transaction types, or keyword searches.
* **Temporal Intelligence:** Built-in date range selectors (This Week, This Month, Custom) for period-over-period financial analysis.
* **Enterprise-Ready Pagination:** Transactions are served via a backend pagination engine, keeping the UI snappy even with thousands of records by loading only a specific subset of data at any time.

### 2. Reports & Analytics Engine
* **Distribution Visualization:** Uses backend `GROUP BY` and `SUM` SQL aggregations to generate dynamic pie charts that visualize spending concentration.
* **Trend Analysis:** Visualizes income vs. expense trends over time. Missing values are normalized to 0 to ensure chart continuity.
* **Interactive Syncing:** The reporting layer is fully integrated with the filtering engine. Adjusting a filter triggers an immediate re-fetch and re-render of charts.

### 3. Frontend Architecture & UI Logic
* **Modular Frontend:** Built with ES6 modules to ensure deterministic rendering and prevent global scope pollution.
* **Memory-Safe Visuals:** Built with Chart.js. To prevent memory leaks, every chart follows a strict lifecycle: fetch data -> transform -> destroy previous instance -> initialize new chart.
* **Defensive Engineering:** Robust error handling ensures the UI remains stable during API failures or empty database results.

### 4. Wishlist System (Savings Goals)
* **Goal Tracking:** Set targets for future purchases or savings milestones.
* **Interactive Progress UI:** High-visibility progress bars and goal cards provide immediate visual gratification as users move closer to their targets.

## System Architecture & Data Flow

InsightVault utilizes a modern, decoupled client-server architecture designed for scalability and deployment flexibility.

`Client (Vercel)` ➔ `API (Node/Express)` ➔ `Database (Turso/SQLite)`

### The Request Lifecycle
1.  **Event Capture:** The JavaScript event listener captures user input and packages the filter parameters into a URL query string.
2.  **Asynchronous Fetch:** An `async/await` fetch call is dispatched to the Express.js backend.
3.  **API Routing:** The Express router identifies the endpoint and passes the parameters to the designated Controller.
4.  **SQL Execution:** The Controller builds a dynamic SQL query, utilizing the database engine to perform sorting, filtering, and aggregating.
5.  **JSON Response:** The backend returns a structured JSON object containing the results and metadata (like total count for pagination).
6.  **DOM Update:** The frontend receives the data, clears existing UI elements, and maps the new data into the DOM.

### RESTful API Documentation

| Endpoint | Method | Params/Query | Description |
| :--- | :--- | :--- | :--- |
| `/api/transactions` | GET | `page`, `limit`, `category`, `type`, `search`, `startDate`, `endDate` | Returns paginated transactions based on active filters. |
| `/api/transactions` | POST | JSON Body | Validates and creates a new transaction record. |
| `/api/reports/totals` | GET | `startDate`, `endDate` | Aggregates income/expense totals for dashboard metrics. |
| `/api/reports/categories` | GET | `type`, `startDate`, `endDate` | Provides grouped data for pie chart visualization. |
| `/api/wishlist` | GET | - | Retrieves savings goals and computed progress. |

## Tech Stack

* **Frontend:** HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript (ES6+), Bootstrap 5, Chart.js.
* **Backend:** Node.js, Express.js.
* **Database:** SQLite3 (Dev), Turso/libSQL (Prod).
* **Hosting:** Vercel (Frontend), Turso (Managed Database).

## Key Design Decisions

### 1. The "Vanilla+" Choice (Why No React?)
I chose to avoid frameworks to ensure my skills were built on a solid foundation. By building the "React way" (component-based thinking) but using Vanilla tools, I gained a deeper appreciation for state management, re-rendering logic, and optimized DOM updates. This demonstrates an understanding of the technology the tools are built upon, not just the tools themselves.

### 2. Strategic Pivot to SQLite (Portability)
I opted for SQLite3 for its exceptional portability. The database is a single file within the project, meaning reviewers can clone the repo and run it instantly without complex DB setups. This file-based approach also made the migration to Turso (Cloud SQLite) seamless for production readiness.

### 3. Computation Offloading (Backend-First)
I made a conscious architectural decision to perform all data "heavy lifting" on the backend. By using SQL for grouping and summing data, I keep the frontend lightweight. This ensures the app remains fast even on lower-end mobile devices, as the client only renders final results.

## 🚧 Project Status

This project is currently in **Active Development (Beta)**.

* **Working:** Full-stack loop, API routing, database persistence, SQL aggregation logic, analytics dashboard, and core filtering engine.
* **Fine-Tuning:** Polishing mobile responsiveness for complex tables and finalizing UI error boundaries for the wishlist system.

## Future Improvements

* **Authentication & Security:** Implementing JWT-based user authentication to allow multiple private user profiles.
* **Predictive Analytics:** Developing a backend service that uses historical data to predict future spending patterns.
* **Data Export:** Adding functionality to export financial summaries as PDF or CSV files for external record-keeping.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Griffinn/InsightVault-demo.git](https://github.com/Griffinn/InsightVault-demo.git)
    cd InsightVault-demo
    ```
2.  **Install dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Environment Setup:** Create a `.env` file in `backend/` and add your database credentials (or rely on the local `database.sqlite` if applicable):
    ```env
    TURSO_DATABASE_URL=your_turso_database_url
    TURSO_AUTH_TOKEN=your_turso_auth_token
    ```
4.  **Run the application:**
    ```bash
    node server.js
    ```
5.  **Access the Dashboard:** Open your browser to `http://localhost:8000`

## Folder Structure

```text
├── backend/ # Express.js Server Environment
│ ├── controllers/ # Business logic & SQL query aggregation
│ ├── routes/ # REST API endpoint definitions
│ ├── db/ # Database connection logic (Turso/SQLite)
│ ├── middleware/ # Custom error handling & logging
│ ├── utils/ # Helper functions for data formatting
│ └── server.js # Main entry point for the backend server
├── frontend/ # Presentation Layer & Client Logic
│ ├── css/ # Modern CSS Grid & Flexbox layouts
│ ├── js/ # Modular Vanilla JS (Charts, UI modules, API logic)
│ ├── pages/ # Semantic HTML structures for sub-pages
│ ├── assets/ # Project images, icons, and static assets
│ └── index.html # Main landing dashboard / SPA Entry
├── .gitignore # Version control exclusions
└── database.sqlite # Portable SQLite file for local testing
```
