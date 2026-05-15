import React, { useState } from "react";
import axios from "axios";

const Forgotpassword = () => {

const [email,setEmail] = useState("");

const handleSubmit = (e) => {
e.preventDefault();

axios.post("http://localhost:5000/forgot-password",{email})
.then(res=>{
alert(res.data.message);
})
.catch(err=>{
alert("Error sending reset link");
});
};

return(
<div className="container mt-5">
<h3>Forgot Password</h3>

<form onSubmit={handleSubmit}>

<div className="form-group">
<label>Email</label>
<input
type="email"
className="form-control"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>
</div>

<button className="btn btn-primary mt-3">
Send Reset Link
</button>

</form>

</div>
)
}

export default Forgotpassword;