# 👨‍💼 Employee Registry

A React.js-based Employee Management web application that allows users to **create, view, update, and delete** employee details dynamically. The app uses **JSON Server** as a mock backend and provides a smooth UI experience with libraries like **Formik**, **Axios**, and **React Toastify**.


## 🚀 Features

-  **Add Employee** – Create and store employee details in the json-server.  
-  **Employee Cards** – Each employee is displayed as an individual card.  
-  **View Employee** – Displays a single employee’s details on a separate page.  
-  **Update Employee** – Edit and update employee information seamlessly.  
-  **Delete Employee** – Permanently removes the selected employee from the json-server.  
-  **Live JSON Server Integration** – Uses `json-server` to simulate a RESTful backend.  
-  **Toast Notifications** – Provides instant success/error feedback for every action.

## 🛠️ Installation

### 1. Clone the Repository
  
    git clone https://github.com/maredishiva/employee-registry.git
    
    cd employee-registry

### 2. JSON Server

- Create a file named `db.json` in the root folder.

- In `db.json`:
  ```bash
    {
      "employees":[{},]
    }
### 3. Intall JSON Server(globally)

    npm install -g json-server

### 4. Run the JSON Server

    json-server --watch db.json
    
This will start the server at
👉 http://localhost:3000/employees

### 5. Inatall React

    npm install

### 6. Run the React App

    npm run dev

  Visit 👉 http://localhost:5173

## 🧭 How to Use

1.Click **“Create Employee”** to add a new employee.
  
2.All employees will be displayed as individual cards.

3.Use:

   - **View** → to see employee details on a dedicated page.
   
   - **Update** → to edit employee information.

   - **Delete** → to remove the employee from the database.

4.All actions are reflected in the JSON Server database instantly.

## 📘 Important Notes

- Make sure both the React app and JSON server are running simultaneously.

## 🔐 Authentication & Authorization

**User Roles:**
- **Admin** – Full access to create, update, delete employees and view activity logs

**Features:**
- User registration with email and password validation
- Secure login with role-based access control
- Protected routes that redirect unauthenticated users to login
- User profile view with personal information
- Session persistence using localStorage

## 📊 Admin Dashboard (Admin Only)

- Total employee count
- Employees by designation (with progress bars)
- Recent additions (last 5 employees)
- Click-to-filter by designation

## 📝 Activity Logs (Admin Only)

- Track CREATE, UPDATE, DELETE, LOGIN/LOGOUT events
- Filter by action type
- Pagination (10 logs per page)
- Sorted by timestamp (newest first)

## 🎨 Theme System

- Light/Dark mode toggle in navbar
- Persistent theme in localStorage
- Applied system-wide

## 🔍 Search & Filter

- Real-time search by name or email
- Filter by job designation
- Alphabetical sorting (A-Z / Z-A)
- Shareable filtered views via URL

## 📄 Pagination

- 6 items per page (Home)
- 10 items per page (Activity Logs)
- Resets on filter/search changes

## 💻 Tech Stack

- **React 19.1.1** – UI library
- **React Router 7.8.2** – Routing
- **Formik 2.4.6** – Form validation
- **Axios 1.11.0** – HTTP requests
- **React Toastify 11.0.5** – Notifications
- **Vite 7.1.2** – Build tool
- **JSON Server 1.0.0-beta.3** – Mock API



## 🎯 Application Workflow

1. **Registration** → Create account with credentials
2. **Login** → Authenticate and access dashboard
3. **Home** → View all employees with search/filter
4. **Admin Actions** → Create, Update, Delete employees
5. **Dashboard** → View analytics and statistics
6. **Activity Logs** → Track all system actions












