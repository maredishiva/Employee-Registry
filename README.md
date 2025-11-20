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
  
    git clone https://github.com/your-username/employee-registry.git)
    
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










