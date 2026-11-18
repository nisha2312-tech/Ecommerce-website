import React, { useState,useEffect, useContext } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { CartContext } from "./context/CartContext";
import { WishlistContext } from "./context/WishlistContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Login = () => {

  /* ===================== REGISTER STATES ===================== */
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  /* ===================== LOGIN STATES 
  ===================== */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  /* ===================== AUTH CHECK ===================== */
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;
  
  

  const { loadCart, setCart } = useContext(CartContext);
  const { loadWishlist, setWishlist } = useContext(WishlistContext);
  /* ===================== REGISTER ===================== */
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (password !== retypePassword) {
      alert("Passwords do not match!");
      return;
    }

    axios
      .post("http://localhost:5000/userregister", {
        firstname,
        lastname,
        email,
        mobile,
        password,
      })
      .then((res) => alert(res.data.message))
      .catch(() => alert("Registration failed"));
  };

  /* ===================== LOGIN ===================== */
  const handleLoginSubmit = (e) => {
  e.preventDefault();

  axios
    .post("http://localhost:5000/userlogin", {
      email: loginEmail,
      password: loginPassword,
    })
    .then((res) => {
      if (res.data.token) {
   

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.firstname);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("userid", res.data.user.id);


        alert("Login successful");
        // loadCart();
        // loadWishlist();
        // navigate("/Products");
        window.location.href = "/Products";
      } else {
        alert("Invalid login credentials");
      }
    })
    .catch((err) => {
  if (!localStorage.getItem("token")) {
    // alert("Login failed");
    alert("Wrong Password");

  }
});
};

  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div>
      <Header/>
      {/* Breadcrumb */}
      <div className="breadcrumb-wrap">
        <div className="container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item"><a href="#">Products</a></li>
            <li className="breadcrumb-item active">Login & Register</li>
          </ul>
        </div>
      </div>

      {/* Login/Register Section */}
      <div className="login">
        <div className="container-fluid">
          <div className="row">
            {/* Register Form */}
            <div className="col-lg-6">
              <div className="register-form">
                <form onSubmit={handleRegisterSubmit} method="post">
                  <div className="row">
                    <div className="col-md-6">
                      <label>First Name</label>
                      <input className="form-control" type="text" placeholder="First Name" 
                      name="firstName" 
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label>Last Name</label>
                      <input className="form-control" type="text" placeholder="Last Name" 
                      name="lastName"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)} required/>
                    </div>
                    <div className="col-md-6">
                      <label>E-mail</label>
                      <input className="form-control" type="email" placeholder="E-mail" 
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="col-md-6">
                      <label>Mobile No</label>
                      <input className="form-control" type="text" placeholder="Mobile No" 
                      name="mobile"
                      value={mobile}
                      onChange={ (e) => setMobile(e.target.value)} required/>
                    </div>
                    <div className="col-md-6">
                      <label>Password</label>
                      <input className="form-control" type="password" placeholder="Password" 
                      name="password"
                      value={password}
                      onChange={ (e) => setPassword(e.target.value)} required/>
                    </div>
                    <div className="col-md-6">
                      <label>Retype Password</label>
                      <input className="form-control" type="password" placeholder="Password" 
                      name="retypePassword"
                      value={retypePassword}
                      onChange={ (e) => setRetypePassword(e.target.value)} required/>
                    </div>
                    <div className="col-md-12">
                      <button className="btn btn-primary w-100" type="submit">Submit</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Login Form */}
            <div className="col-lg-6">
              <div className="login-form">
                <form onSubmit={handleLoginSubmit} method="post">
                  <div className="row">
                    <div className="col-md-6">
                      <label>E-mail</label>
                      <input className="form-control" type="text" placeholder="E-mail" 
                      name="email"
                      value={loginEmail}
                      onChange={ (e) => setLoginEmail(e.target.value) } required/>
                    </div>
                    <div className="col-md-6">
                      <label>Password</label>
                      <input className="form-control" type="password" placeholder="Password" 
                      name="password"
                      value={loginPassword}
                      onChange={ (e) => setLoginPassword(e.target.value) } required/>
                    </div>
                    <div className="col-md-12 text-end">
                      <Link to="/forgotpassword">Forgot Password?</Link>
                    </div>
                    <div className="col-md-12">
                      <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="newaccount" />
                        <label className="custom-control-label" htmlFor="newaccount">
                          Keep me signed in
                        </label>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <button className="btn btn-primary w-100" type="submit">Login</button>
                    </div>
                  </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer start */}
      <Footer/>

        {/* Back to Top */}
        <a href="#" className="back-to-top">
          <i className="fa fa-chevron-up"></i>
        </a>
  </div>
  )};
  export default Login;
