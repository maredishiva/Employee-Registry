import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Home from "./Components/Home"
import CreateEmployee from "./Components/CreateEmployee"
import UpdateEmployee from "./Components/UpdateEmployee"
import ViewEmployee from "./Components/ViewEmployee"
import EmployeeProfile from "./Components/EmployeeProfile"
import Register from "./Components/Register"
import Login from "./Components/Login"
import Dashboard from "./Components/Dashboard"
import ActivityLogs from "./Components/ActivityLogs"
import ProtectedRoute from "./Components/ProtectedRoute"
import PageNotFound from "./Components/PageNotFound"
import { ThemeProvider } from "./contexts/ThemeContext"
import "./styles/theme.css"
import "./style.css"
import "./styles/auth.css"
import "./styles/navbar.css"

// Layout component to include navbar on all pages
const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
)
  
let routes = createBrowserRouter([
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/",
      element: <Layout><ProtectedRoute><Home /></ProtectedRoute></Layout>
    },
    {
      path: "/employees/:id",
      element: <Layout><ProtectedRoute><EmployeeProfile /></ProtectedRoute></Layout>
    },
    {
      path: "/create-employee",
      element: <Layout><ProtectedRoute adminOnly={true}><CreateEmployee /></ProtectedRoute></Layout>
    },
    {
      path: "/update-employee/:id",
      element: <Layout><ProtectedRoute adminOnly={true}><UpdateEmployee /></ProtectedRoute></Layout>
    },
    {
      path: "/view-employee/:id",
      element: <Layout><ProtectedRoute><ViewEmployee /></ProtectedRoute></Layout>
    },
    {
      path: "/dashboard",
      element: <Layout><ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute></Layout>
    },
    {
      path: "/logs",
      element: <Layout><ProtectedRoute adminOnly={true}><ActivityLogs /></ProtectedRoute></Layout>
    },
    {
      path: "*",
      element: <Layout><PageNotFound /></Layout>
    }
  ])

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={routes}/>
    </ThemeProvider>
  )
}
export default App