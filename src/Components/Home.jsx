import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
  let [details,setDetails] = useState(null)
  let navigator = useNavigate()
  let fetchData = async()=>{
    let {data} = await axios.get("http://localhost:3000/employee") //Created a fetchData function because of axios.
    setDetails(data)
  }
  useEffect(()=>{
    fetchData() //Calling the fetchData() inside the useEffect() with [] to avoid multiple resquests in Network while loading our page.
  },[])
  let handleDelete = (id)=>{
    axios.delete(`http://localhost:3000/employee/${id}`)
    location.reload()
  }
  return <>
    <section id="home_page">
        <nav>
            <h1>Employee Registry</h1>
            <button onClick={()=>navigator("/create-employee")}>Create Employee</button>
        </nav>
    </section>
    <main id="home_main">
        {details == null ? "Loading...":details.map((employee)=>{
            return <article id="home_article" key={employee.id} >
              <img src={employee.photo} alt={employee.name} height="150" width="150" id="home_img"/>
              <h1>{employee.name}</h1>
              <h4>{employee.designation}</h4>
              <p id="home_email"><i class="fa-solid fa-envelope"></i>{employee.email}</p>
              <p id="home_phone"><i class="fa-solid fa-phone"></i>{employee.phone}</p>
              <p id="home_dob"><i class="fa-solid fa-calendar"></i>{employee.dob}</p>
              <div id="buttons">
                <button id="button_view" onClick={()=>navigator(`/view-employee/${employee.id}`)}> <i class="fa-regular fa-eye"></i>View</button>
                <button id="button_update" onClick={()=>navigator(`/update-employee/${employee.id}`)}> <i class="fa-solid fa-pen-to-square"></i>Update</button>
                <button id="button_delete" onClick={()=>handleDelete(employee.id)}><i class="fa-solid fa-trash"></i>Delete</button>
              </div>
              </article>
              })}
    </main>
  </>
}
export default Home