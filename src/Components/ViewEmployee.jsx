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
    <div>
     {employee == null ? "Loading...":<article>
        <h1>{employee.name}</h1>
        <h3>{employee.designation}</h3>
        <p>{employee.phone}</p>
        <p>{employee.dob}</p>
        <p>{employee.email}</p>
        <img src={employee.photo} alt={employee.name} height="200" width="200"/>
      </article>}
    </div>
  )
}

export default ViewEmployee