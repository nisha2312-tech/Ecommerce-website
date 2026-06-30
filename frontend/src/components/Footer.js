import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Footer() {
      //login
    /* ===================== AUTH CHECK ===================== */
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const isLoggedIn = !!token;

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

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return
  (
    <div>
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
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
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
                    {/* <input type="text" placeholder="Search" />
                    <button>
                      <i className="fa fa-search"></i>
                    </button> */}
                    <input type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          navigate(`/products?search=${searchTerm}`);
                        }
                      }}
                    />
                    <button
                      onClick={() => navigate(`/products?search=${searchTerm}`)}
                    >
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
                    {/* <a href="cart.html" className="btn cart">
                      <i className="fa fa-shopping-cart"></i>
                      <span>(0)</span>
                    </a> */}
                    <Link to="/Cart" className="btn cart">
                      <i className="fa fa-shopping-cart"></i>
                      <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default Footer;