import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./Components/Home"
import CreateEmployee from "./Components/CreateEmployee"
import UpdateEmployee from "./Components/UpdateEmployee"
import ViewEmployee from "./Components/ViewEmployee"
import PageNotFound from "./Components/PageNotFound"
import "./style.css"
  
let routes = createBrowserRouter([
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/create-employee",
      element:<CreateEmployee/>
    },
    {
      path:"/update-employee/:id",
      element:<UpdateEmployee/>
    },
    {
      path:"/view-employee/:id",
      element:<ViewEmployee/>
    },
    {
      path:"*",
      element:<PageNotFound/>
    }
  ])
const App = () => {
  return (
    <RouterProvider router={routes}/>
  )
}
export default App