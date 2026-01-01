import axios from "axios"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "../styles/alerts.css"

const CreateEmployee = () => {
  const [message, setMessage] = useState("")
    let navigate = useNavigate()
    let formik = useFormik({
      initialValues:{
        name:"",
        designation:"",
        phone:"",
        dob:"",
        email:"",
        photo:""
      },
      onSubmit: async (details,{resetForm})=>{
        try {
          await axios.post("http://localhost:3000/employee",details)
          resetForm() //Resetting the form after sumbitting
          setMessage("Created employee successfully")
          window.alert("Created employee successfully")
          navigate("/")
        } catch (error) {
          setMessage("Failed to create employee")
          console.error(error)
        }
      }
    })
    let handleImageChange = (e)=>{
      let file = e.target.files[0]
      if(file){
        let reader = new FileReader()
        reader.onload=()=>{
          formik.setFieldValue("photo",reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
    let {name,designation,phone,dob,email,photo} = formik.values
    let {handleSubmit,handleChange} = formik
  return (
    <div id="form_parent">
      <form onSubmit={handleSubmit} id="form">
        <h1>Create a Employee</h1>
        {message && <div className="inline-alert">{message}</div>}
        <label htmlFor="name">Full Name</label>
        <br />
        <input type="text" id="name" name="name" placeholder="Enter your full name" value={name} onChange={handleChange} size={65} />
        <br/><br/>
        <label htmlFor="phone">Phone Number</label>
        <br />
        <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" value={phone} onChange={handleChange} size={65}/>
        <br/><br/>
        <label htmlFor="dob">Date of Birth</label>
        <br />
        <input type="date" id="dob" name="dob" value={dob} onChange={handleChange} size={65}/>
        <br/><br/>
        <label htmlFor="email">Email Address</label>
        <br />
        <input type="email" id="email" name="email" placeholder="Enter your email address" value={email} onChange={handleChange} size={65}/>
        <br/><br/>
        <label htmlFor="designation">Designation</label>
        <br />
        <input type="designation" id="designation" name="designation" placeholder="Enter your job title/desigantion" value={designation} onChange={handleChange} size={65}/>
        <br/><br/>
        <label htmlFor="photo">Upload Photo</label>
        <br />
        <input type="file" id="photo" name="photo" onChange={handleImageChange}/>
        <br/><br/>
        <div id="for_buttons">
          <input type="submit" value="Create Employee"/>
          <br/><br/>
          <button type="button" onClick={()=>navigate("/")}>Go to Home</button>
        </div>
      </form>
    </div>
  )
}
export default CreateEmployee