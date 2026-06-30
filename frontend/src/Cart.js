import React from "react";
import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "font-awesome/css/font-awesome.min.css";
import { initHomeScripts } from "./main";
import "./style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Cart = () => {


    // Auth
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;
  // --------------------
  // USER-SPECIFIC KEY
  // --------------------
  const wishlistKey = username ? `wishlist_${username}` : null;
  // USER-SPECIFIC CART KEY
  const cartKey = username ? `cart_${username}` : null;
  // states
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
      // Add to Cart function
    //   const addToCart = (product) => {
    //   if (!cartKey) return;
  
    //   let newCart = [...cart];
    //   const existingIndex = newCart.findIndex((p) => p.id === product.id);
  
    //   if (existingIndex !== -1) {
    //     newCart[existingIndex].quantity += 1;
    //   } else {
    //     newCart.push({
    //       ...product,
    //       quantity: 1,
    //     });
    //   }
  
    //   setCart(newCart);
    //   localStorage.setItem(cartKey, JSON.stringify(newCart));
    //   alert("Added to Cart!");
    // };


  // ==========================
  useEffect(() => {
  if (!cartKey) {
    setCart([]);
    return;
  }

    setCart(JSON.parse(localStorage.getItem(cartKey)) || []);
  }, [cartKey]);
  
    // Remove from cart

  const removeFromCart = (id, size, color) => {
  if (!window.confirm("Remove this item from cart?")) return;
  const newCart = cart.filter(
    (item) =>
      !(
        item.id === id &&
        item.size === size &&
        item.color === color
      )
  );

  setCart(newCart);
  localStorage.setItem(cartKey, JSON.stringify(newCart));
};

  const updateQuantity = (id, amount) => {
    const newCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    );

    setCart(newCart);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
  };
  // subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
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
                </div>
    
                  
                    <div className="nav-item dropdown">
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
                  <li className="breadcrumb-item active">Product Detail</li>
              </ul>
          </div>
      </div>
      {/* <!-- Breadcrumb End --> */}

      {/* Cart Page */}
      <div className="cart-page">
        <div className="container-fluid">
          <div className="row">
            {/* Cart Table */}
            <div className="col-lg-8">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    <tr>
                      <td>
                        <div className="img">
                          <img src="images/product-1.jpg" alt="Product" />
                          <p>Product Name</p>
                        </div>
                      </td>
                      <td>$99</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value="1"
                          readOnly
                        />
                      </td>
                      <td>$99</td>
                      <td>
                        <button className="btn btn-danger">
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody> */}
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={`http://localhost:5000/${item.image}`}
                            alt={item.productname}
                            width="60"
                          />
                          <p>{item.productname}</p>
                        </td>
                        <td>${item.price}</td>
                        {/* <td><small>Size: <strong>{item.size}</strong></small></td>
                        <td><small>Color: <strong>{item.color}</strong></small></td> */}
                        <td>
                          <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span className="mx-2">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </td>

                        <td>${item.price * item.quantity}</td>

                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => removeFromCart(item.id,item.size,item.color)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="col-lg-4">
              <div className="cart-summary">
                  <div className="checkout-inner">
                    <div className="checkout-summary">
                      <h1 >Cart Summary</h1>
                      <p className="sub-total">
                        Sub Total : <span>${subtotal}</span>
                      </p>
                      <p className="ship-cost">
                        Shipping Cost : <span>$5</span>
                      </p>
                      <h1>
                        Grand Total : <span>${subtotal + 5}</span>
                      </h1>
                    </div>
                  </div>
              </div>
              <br/>
              <div className="cart-btn">
                <Link to="/checkout">
                <button className="btn btn-primary w-100">
                  Checkout
                </button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Footer start*/}
        <Footer/>
      

      {/* Back to Top */}
      <a href="#" className="back-to-top">
        <i className="fa fa-chevron-up"></i>
      </a>
    </div>
  );
};

export default Cart;
