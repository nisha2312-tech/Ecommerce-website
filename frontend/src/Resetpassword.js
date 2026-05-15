import React,{useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const Resetpassword = () => {

const {token} = useParams();

const [password,setPassword] = useState("");

const handleSubmit=(e)=>{
e.preventDefault();

axios.post(`http://localhost:5000/reset-password/${token}`,{password})
.then(res=>{
alert(res.data.message);
window.location="/login";
})
.catch(err=>{
alert("Error resetting password");
});
};

return(

<div className="container mt-5">
<h3>Reset Password</h3>

<form onSubmit={handleSubmit}>

<input
type="password"
className="form-control"
placeholder="New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button className="btn btn-success mt-3">
Reset Password
</button>

</form>

</div>

)
}

export default Resetpassword;