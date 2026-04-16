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
