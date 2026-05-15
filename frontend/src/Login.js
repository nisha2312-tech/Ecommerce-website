import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

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
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <i className="fa fa-envelope"></i> support@email.com
            </div>
            <div className="col-sm-6">
              <i className="fa fa-phone-alt"></i> +012-345-6789
            </div>
          </div>
        </div>
      </div>

      {/* Nav Bar */}
      <div className="nav">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-md bg-dark navbar-dark">
            <a href="#" className="navbar-brand">
              MENU
            </a>
            <button
              type="button"
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
              <div className="navbar-nav mr-auto">
                <Link to="/" className="nav-item nav-link active">Home</Link>
                <Link to="/Products" className="nav-item nav-link">Shop</Link>
                <Link to="/Aboutus" className="nav-item nav-link">Aboutus</Link>
                <Link to="/Myaccount" className="nav-item nav-link">My Account</Link>
                <Link to="/Contactus" className="nav-item nav-link">Contact us</Link>
              </div>

                {/* ===================== USER DROPDOWN ===================== */}
                
                <div className="navbar-nav ms-auto">
                  <div className="nav-item dropdown">
                    <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                      {/* User Account */}
                      {isLoggedIn ? username : "User Account"}
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      {!isLoggedIn ? (
                      <Link to="/login" className="dropdown-item">Login & Register</Link>
                      ) : (
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                      )}
                    </div>
                </div>
                
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className="logo">
                <a href="index.html">
                  <img src="images/logo.png" alt="Logo" />
                </a>
              </div>
            </div>
            <div className="col-md-6">
              <div className="search">
                <input type="text" placeholder="Search" />
                <button>
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="user">
                <Link to ="/Wishlist" className="btn wishlist">
                  <i className="fa fa-heart"></i>
                  <span>{wishlist.length}</span>
                </Link>
                <Link to="/Cart" className="btn cart">
                  <i className="fa fa-shopping-cart"></i>
                  <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                </Link>
              </div>
            </div>
          </div>
      </div>
    </div>

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

        {/* Footer */}
      <div className="footer">
        <div className="container-fluid">
          <div className="row">
            {/* Contact */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h2>Get in Touch</h2>
                <div className="contact-info">
                  <p>
                    <i className="fa fa-map-marker"></i> 123 E Store, Los Angeles, USA
                  </p>
                  <p>
                    <i className="fa fa-envelope"></i> email@example.com
                  </p>
                  <p>
                    <i className="fa fa-phone"></i> +123-456-7890
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h2>Follow Us</h2>
                <div className="contact-info">
                  <div className="social">
                    {["twitter", "facebook-f", "linkedin-in", "instagram", "youtube"].map(
                      (platform, i) => (
                        <a href="#" key={i}>
                          <i className={`fab fa-${platform}`}></i>
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h2>Company Info</h2>
                <ul>
                  <li>
                    <Link to="/Aboutus" >About Us</Link>
                
                  </li>
                  <li>
                    <Link to="/Privacypolicy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/Terms">Terms & Condition</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Purchase Info */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h2>Purchase Info</h2>
                <ul>
                  <li>
                    <Link to="/Paymentpolicy">Payment Policy</Link>
                  </li>
                  <li>
                    <Link to="/Shippingpolicy">Shippingpolicy</Link>
                  </li>
                  <li>
                    <Link to="/Returnpolicy">Return Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row payment align-items-center">
            <div className="col-md-6">
              <div className="payment-method">
                <h2>We Accept:</h2>
                <img src="images/payment-method.png" alt="Payment Method" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="payment-security">
                <h2>Secured By:</h2>
                <img src="images/godaddy.svg" alt="Payment Security" />
                <img src="images/norton.svg" alt="Payment Security" />
                <img src="images/ssl.svg" alt="Payment Security" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-12 copyright">
              <p align="center">
                Copyright &copy; <a href="#">Estore</a>. All Rights
                Reserved
              </p>
            </div>
            
          </div>
        </div>
      </div>

        {/* Back to Top */}
        <a href="#" className="back-to-top">
          <i className="fa fa-chevron-up"></i>
        </a>
  </div>
  )};
  export default Login;
