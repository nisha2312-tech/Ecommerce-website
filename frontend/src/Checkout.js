import React, { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import { initHomeScripts } from "./main";
import "./style.css";
// this code convert into react js and node js from backend
const Checkout = () => {
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
    //states

    const [wishlist, setWishlist] = useState([]);

    // Cart state (for count)
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [paymentmethod, setPaymentmethod] = useState("");
    const [billing, setBilling] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    address: "",
    country: "",
    city: "",
    state: "",
    zip: "",
  });
  // focus on firstname
  const firstNameRef = useRef(null);
  const [address, setAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
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

  

  
  // ---------------- BILLING CHANGE ----------------
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // ---------------- CALCULATIONS ----------------
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;
    
  
  const placeOrder = async () => {
    
    if (!token) {
      alert("Please login first");
      return;
    }

    if (!paymentmethod) {
    alert("Please select a payment method");
    return;
    }
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    try{
      // 1️⃣ SAVE ADDRESS(optional)
        try {
          
          await axios.post(
            "http://localhost:5000/api/address",
            {
              firstname: billing.firstname,
              lastname:billing.lastname,
              email: billing.email,
              mobile: billing.mobile,
              address: billing.address,
              city: billing.city,
              state: billing.state,
              country: billing.country,
              zip: billing.zip
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
              
              
            }
            
          );
          alert(res.data.message);
          // refresh UI
          setAddress(billing);
          setIsEditingAddress(false);

        }
        catch (err) {
            console.log("Address save failed but continuing order");
          }
        
       // 2️⃣ PLACE ORDER
      const res = await axios.post("http://localhost:5000/api/order", {
        billing,
        paymentmethod,
        cart
        },
        
        {
    headers: {
      Authorization: `Bearer ${token}`,
      },
    }

    );      
      alert("Order placed successfully!");
        console.log(res.data);
        // Clear cart after order
          localStorage.removeItem(cartKey);
          setCart([]);
      } 
      catch (error) {
        console.log("FULL ERROR:", error);
        alert(JSON.stringify(error.response?.data));
      }

    };
    // fetch address
      useEffect(() => {

      const fetchAddress = async () => {

        try{
          
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:5000/api/address",{
            headers:{

              Authorization:`Bearer ${token}`
            }
          });

          const data = await res.json();
          
          if(res.ok){
            setAddress(data); 
          }
        }
        catch(err){
          console.log("Address fetch error",err);
        }
      };
      fetchAddress();

    },[]);

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
      {/* <div className="nav">
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
                              <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">User Account</a>
                              <div className="dropdown-menu">
                                  <a href="#" className="dropdown-item">Login</a>
                                  <a href="#" className="dropdown-item">Register</a>
                              </div>
                          </div>
                      </div>
                  </div>
              </nav>
          </div>
      </div> */}
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
    
      {/* Breadcrumb */}
      <div className="breadcrumb-wrap">
        <div className="container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active">Products</li>
            <li className="breadcrumb-item active">Checkout</li>
          </ul>
        </div>
      </div>

      {/* Checkout Start */}
      <div className="checkout">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="checkout-inner">
                <div className="billing-address">
                  <h2>Billing Address</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <label>First Name</label>
                      <input
                        ref={firstNameRef}
                        className="form-control mb-2"
                        name="firstname"
                        placeholder="First Name"
                        value={billing.firstname}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Last Name</label>
                      <input
                        className="form-control mb-2"
                        name="lastname"
                        placeholder="Last Name"
                        value={billing.lastname}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>E-mail</label>
                      <input
                        className="form-control mb-2"
                        name="email"
                        placeholder="Email"
                        value={billing.email}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Mobile No</label>
                      <input
                        className="form-control mb-2"
                        name="mobile"
                        placeholder="Mobile"
                        value={billing.mobile}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="col-md-12">
                      <label>Address</label>
                      <input
                        className="form-control mb-2"
                        name="address"
                        placeholder="Address"
                        value={billing.address}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Country</label>
                      <select
                        className="form-select mb-2"
                        name="country"
                        value={billing.country}
                        onChange={handleBillingChange}
                      >
                        <option>United States</option>
                        <option>Afghanistan</option>
                        <option>Albania</option>
                        <option>Algeria</option>
                        <option>India</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>City</label>
                      <input
                        className="form-control mb-2"
                        name="city"
                        placeholder="City"
                        value={billing.city}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>State</label>
                      <input
                        className="form-control mb-2"
                        name="state"
                        placeholder="State"
                        value={billing.state}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>ZIP Code</label>
                      <input
                        className="form-control mb-2"
                        name="zip"
                        placeholder="ZIP Code"
                        value={billing.zip}
                        onChange={handleBillingChange}
                      />
                    </div>
                    
                  </div>
                </div>
                <h2>Saved Billing Address</h2>

                  {/* ✅ SAVED ADDRESS BOX */}
                  {/* {address && !isEditingAddress && ( */}
                  {address && (
                    <div className="card p-3 mb-3 shadow-sm">
                      <h6>Saved Address</h6>

                      <p>
                        {address.firstname} {address.lastname}<br/>
                        {address.email}<br/>
                        {address.address}, {address.city}, {address.state}<br/>
                        {address.country} - {address.zip}
                      </p>

                      <p>Mobile: {address.mobile}</p>

                      <button
                        className="btn btn-success me-2"
                        onClick={() => {
                          // ✅ AUTO FILL FORM
                          setBilling({
                            firstname: address.firstname || "",
                            lastname: address.lastname || "",
                            email: address.email,
                            mobile: address.mobile,
                            address: address.address,
                            country: address.country,
                            city: address.city,
                            state: address.state,
                            zip: address.zip
                          });
                        }}
                      >
                        Use this Address
                      </button>

                      <button
                        className="btn btn-dark"
                        onClick={() => {setIsEditingAddress(true);
                        // ✅ Clear form fields
                        setBilling({
                          firstname: "",
                          lastname: "",
                          email: "",
                          mobile: "",
                          address: "",
                          country: "",
                          city: "",
                          state: "",
                          zip: ""
                        });
                        // Focus after render
                          setTimeout(() => {
                            firstNameRef.current?.focus();
                          },0);
                      }}  
                      >
                        Add New Address
                      </button>
                    </div>
                  )}
                <div className="checkout-payment">
                  <div className="payment-methods">
                    <h1>Payment Methods</h1>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          value="credit"
                          checked={paymentmethod === "credit"}
                          onChange={(e) => setPaymentmethod(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="credit">
                          Credit / Debit Card
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          value="UPIpay"
                          checked={paymentmethod === "UPIpay"}
                          onChange={(e) => setPaymentmethod(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="UPIpay">
                          UPI Pay
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          value="paypal"
                          checked={paymentmethod === "paypal"}
                          onChange={(e) => setPaymentmethod(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="paypal">
                          PayPal
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentmethod === "cod"}
                          onChange={(e) => setPaymentmethod(e.target.value)}
                        />
                       
                        <label className="form-check-label" htmlFor="cod">
                          Cash on Delivery
                        </label>
                      </div>
                    </div>
                    {/* <!-- Credit Card Form --> */}
                    {paymentmethod === "credit" && (
                    <div className="payment-form">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Name on Card</label>
                          <input type="text" className="form-control" placeholder="Full name"/>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Card Number</label>
                          <input type="text" className="form-control" placeholder="1234 5678 9012 3456"/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Expiry</label>
                          <input type="text" className="form-control" placeholder="MM/YY"/>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">CVV</label>
                          <input type="text" className="form-control" placeholder="123"/>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                    {/* <!-- UPI Pay Form --> */}
                  {paymentmethod === "UPIpay" && (
                  <div className="payment-form">
                    <div className="mb-3">
                      <label className="form-label">UPI ID</label>
                      <input type="email" className="form-control" placeholder="example@UPIID.com"/>
                    </div>
                  </div>
                  )}
                    {/* <!-- PayPal Form --> */}
                  {paymentmethod === "paypal" && (
                  <div className="payment-form">
                    <div className="mb-3">
                      <label className="form-label">PayPal Email</label>
                      <input type="email" className="form-control" placeholder="example@paypal.com"/>
                    </div>
                  </div>
                  )}
                    {/* <!-- Cash on Delivery --> */}
                  {paymentmethod === "cod" && (
                  <div className="payment-form">
                    <div className="alert alert-info">
                      You will pay in cash when your order is delivered.
                    </div>
                  </div>
                  )}
                </div>
                <div className="checkout-btn">
                  <button className="btn btn-primary w-100" onClick={placeOrder}>Place Order</button>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="checkout-inner">
                <div className="checkout-summary">
                  <h1>Cart Summary</h1>

                  {cart.map(item => (
                    <p key={item.id}>
                      {item.productname} x {item.quantity}
                      <span>${item.price * item.quantity}</span>
                    </p>
                  ))}

                  <p className="sub-total">
                    Sub Total <span>${subtotal}</span>
                  </p>

                  <p className="ship-cost">
                    Shipping <span>${shipping}</span>
                  </p>

                  <h2>
                    Total <span>${total}</span>
                  </h2>
                </div>

                    
                
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Checkout End */}

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
  );
};
export default Checkout;
