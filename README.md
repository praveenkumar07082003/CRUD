# Patient CRUD (Node.js + Express + MySQL) - Backend + Frontend

## What you get
- REST API (Create, Read, Update, Delete) for patients
- Simple frontend (public/) to add, list, edit, delete patients
- Uses MySQL database

## Setup

1. Copy `.env.example` to `.env` and fill your DB credentials.
   ```
   cp .env.example .env
   ```

2. Create the database and table (use MySQL CLI or Workbench):
   ```sql
   CREATE DATABASE patient_management;
   USE patient_management;
   CREATE TABLE patients (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     age INT NOT NULL,
     date_of_joining DATE NOT NULL,
     email VARCHAR(150) NOT NULL UNIQUE,
     phone VARCHAR(20) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the server:
   - Development (auto-reload):
     ```
     npm run dev
     ```
   - Production:
     ```
     npm start
     ```

5. Open the frontend:
   - http://localhost:3000

## Notes
- The frontend talks to the API at `/api/patients`.
- Basic validation is implemented on the frontend and backend; for production, add stronger validation and security.
