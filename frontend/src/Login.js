import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Login = () => {

  /* ===================== REGISTER STATES ===================== */
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  /* ===================== LOGIN STATES ===================== */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  /* ===================== AUTH CHECK ===================== */
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;
  
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
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };
  // --------------------
  // USER-SPECIFIC KEY
  // --------------------
  const wishlistKey = username ? `wishlist_${username}` : null;
  // USER-SPECIFIC CART KEY
  const cartKey = username ? `cart_${username}` : null;
  const [wishlist, setWishlist] = useState([]);
  // Cart state (for count)
  const [cart, setCart] = useState([]);  
  // Init scripts and load wishlist once
    useEffect(() => {
      // initHomeScripts();
      if(!wishlistKey){
        setWishlist([]);
      }
      else{
        setWishlist(JSON.parse(localStorage.getItem(wishlistKey)) || []);
      }
        if (cartKey) {
      setCart(JSON.parse(localStorage.getItem(cartKey)) || []);
      }
    }, [wishlistKey, cartKey]);
  
    // Add/remove product from wishlist
    const toggleWishlist = (product) => {
      if(!wishlistKey) {
        alert("Please login to use wishlist");
        return;
      }
      let newWishlist;
      if (wishlist.some((p) => p.id === product.id)) {
        // Remove if already in wishlist
        newWishlist = wishlist.filter((p) => p.id !== product.id);
      } else {
        // Add if not in wishlist
        newWishlist = [...wishlist, product];
      }
      setWishlist(newWishlist);
      localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
    };
  
    // Check if product is in wishlist
    const isInWishlist = (productId) => {
      return wishlist.some((p) => p.id === productId);
    };
      // Add to Cart function
      const addToCart = (product) => {
      if (!cartKey){
        alert("please login first") 
        return;
      }
      let newCart = [...cart];
      const existingIndex = newCart.findIndex((p) => p.id === product.id);
  
      if (existingIndex !== -1) {
        newCart[existingIndex].quantity += 1;
      } else {
        newCart.push({
          ...product,
          quantity: 1,
        });
      }
  
      setCart(newCart);
      localStorage.setItem(cartKey, JSON.stringify(newCart));
      alert("Added to Cart!");
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
