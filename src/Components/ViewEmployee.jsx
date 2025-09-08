import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const ViewEmployee = () => {
  let [employee,setEmployee] = useState(null)
  let {id} = useParams() //useParams() is used to extract the url with respect to individual id's
  console.log(id)
  let fetchData = async()=>{
  let {data} = await axios.get(`http://localhost:3000/employee/${id}`)
  setEmployee(data)
}
useEffect(()=>{
  fetchData()
},[])
  return (
    <div id="view_parent">
     {employee == null ? "Loading...":<article id="view_article">
        <aside id="view_aside_one">
          <img src={employee.photo} alt={employee.name} height="200" width="200"/>
        </aside>
        <aside id="view_aside_two">
          <h1>{employee.name}</h1>
          <h3>{employee.designation}</h3>
          <hr />
          <h4>CONTACT INFORMATION</h4>
          <p>{employee.phone}</p>
          <p>{employee.email}</p>
          <h4>DATE OF BIRTH</h4>
          <p>{employee.dob}</p>
        </aside>
      </article>}
    </div>
  )
}

export default ViewEmployee