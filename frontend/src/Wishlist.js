import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { initHomeScripts } from "./main";
import "./style.css";

const Wishlist = () => {
  // --------------------
  // AUTH
  // --------------------
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;
  const [product, setProduct] = useState(null);
  
  // --------------------
  // USER-SPECIFIC KEY
  // --------------------
  const wishlistKey = username ? `wishlist_${username}` : null;
  // USER-SPECIFIC CART KEY
  const cartKey = username ? `cart_${username}` : null;
  //states

  const [wishlist, setWishlist] = useState([]);
  // Cart state (for count)
  const [cart, setCart] = useState([]); 

  // Init scripts and load wishlist once
    useEffect(() => {
      initHomeScripts();
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
  // --------------------
  // LOAD USER WISHLIST
  // --------------------
  useEffect(() => {
    if (!wishlistKey) {
      setWishlist([]);
      return;
    }

    const storedWishlist =
      JSON.parse(localStorage.getItem(wishlistKey)) || [];
    setWishlist(storedWishlist);
  }, [wishlistKey]);

  // --------------------
  // REMOVE ITEM
  // --------------------
  const handleRemove = (id) => {
    const newWishlist = wishlist.filter((p) => p.id !== id);
    setWishlist(newWishlist);

    if (wishlistKey) {
      localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
    }
  };

  if (wishlist.length === 0) {
    return <h3 className="text-center my-5">Your wishlist is empty!</h3>;
  }
  // addtocart code

//     const addToCart = () => {
//       const cartKey = `cart_${username}`;
//       const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

//       const cartItem = {
//           id: product._id,
//           productname: product.productname,
//           price: product.price,
//           image: product.images[0],
//           quantity: 1,
//       };

//       // check if same product exists
//       const existingIndex = cart.findIndex(
//           item => item.id === cartItem.id
//       );

//       if (existingIndex !== -1) {
//           cart[existingIndex].quantity += 1;
//       } else {
//           cart.push(cartItem);
//       }

//       localStorage.setItem(cartKey, JSON.stringify(cart));
//       alert("Added to cart!");
//   };
// add to cart button code

    const addToCart = (product) => {
    if (!cartKey){
      alert("Please Login First");
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
  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div>
      {/* Top bar Start  */}
        <div className="top-bar">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-6">
                        <i className="fa fa-envelope"></i>
                        support@email.com
                    </div>
                    <div className="col-sm-6">
                        <i className="fa fa-phone-alt"></i>
                        +012-345-6789
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- Top bar End --> */}
        {/* <!-- Nav Bar Start --> */}
        <div className="nav">
            <div className="container-fluid">
                <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                    <a href="#" className="navbar-brand">MENU</a>
                    <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
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
                        <div className="navbar-nav ml-auto">
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
                            {/* <div className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">User Account</a>
                                <div className="dropdown-menu">
                                    <a href="#" className="dropdown-item">Login</a>
                                    <a href="#" className="dropdown-item">Register</a>
                                </div>
                            </div> */}
                        </div>
                        </div>
                      </div>
                </nav>
            </div>
          </div>
        {/* <!-- Nav Bar End -->       */}
        {/* <!-- Bottom Bar Start --> */}
        <div className="bottom-bar">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-3">
                        <div className="logo">
                            <a href="index.html">
                                <img src="/images/logo.png" alt="Logo"/>
                            </a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="search">
                            <input type="text" placeholder="Search"/>
                            <button><i className="fa fa-search"></i></button>
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
        {/* <!-- Bottom Bar End -->  */}
        {/* <!-- Breadcrumb Start --> */}
        <div className="breadcrumb-wrap">
          <div className="container-fluid">
              <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item"><a href="#">Products</a></li>
                  <li className="breadcrumb-item active">Wishlist</li>

              </ul>
          </div>
      </div>
      {/* <!-- Breadcrumb End --> */}
      
      <div className="container my-5">
        <div className="row">
          {wishlist.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card h-100">
                <img
                  src={`http://localhost:5000/${product.image}`}
                  className="card-img-top"
                  alt={product.productname}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.productname}</h5>
                  <p className="card-text">${product.price}</p>
                  <button
                    className="btn btn-danger remove"
                    onClick={() => handleRemove(product.id)}
                  >
                    Remove
                  </button>
                  <button
                          className="btn btn-primary"
                          onClick={() => addToCart(product)}
                        >
                          <i className="fa fa-shopping-cart"></i> Add to Cart
                        </button>
                  {/* <Link to="/Cart" className="btn btn-danger" style = {{float:"right"}}>
                    Add to Cart
                  </Link> */}
                </div>
              </div>
            </div>
          ))}
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
        <a href="#" className="back-to-top"><i className="fa fa-chevron-up"></i></a>

    </div>
  );
};

export default Wishlist;
