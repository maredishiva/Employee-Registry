import axios from "axios"
import { useFormik } from "formik"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ToastContainer,toast } from "react-toastify"
import { useParams } from "react-router-dom"

const UpdateEmployee = () => {
  let navigator = useNavigate()
  let {id} = useParams()

  let formik = useFormik(
      {
        initialValues:{
          name:"",
          email:"",
          phone:"",
          dob:"",
          designation:"",
          photo:""
        },
        onSubmit:(details,{resetForm})=>{
          axios.put(`http://localhost:3000/employee/${id}`,details)
          resetForm()
          toast.success("Updated Employee Successfully")
          setTimeout(()=>{
            navigator("/")
          },5000)
        }
      }
    )
  let handleImageChange = (e)=>{
    let file = e.target.files[0]
    if(file){
      let reader = new FileReader()
      reader.onload =()=>{
        formik.setFieldValue("photo",reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  let fetchData = async()=>{
    let {data} = await axios.get(`http://localhost:3000/employee/${id}`)
    formik.setValues(data)
  }
  useEffect(()=>{
    fetchData()
  },[])
  let {name,email,phone,dob,designation} = formik.values
  let {handleChange,handleSubmit} = formik
  return (
     <div id="form_parent">
      <form onSubmit={handleSubmit} id="form">
        <h1>Update a Employee</h1>
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
          <input type="submit" value="Update Employee"/>
          <br/><br/>
          <ToastContainer/>
          <button onClick={()=>navigator("/")}>Go to Home</button>
        </div>
      </form>
    </div>
  )
}

export default UpdateEmployee