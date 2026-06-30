  import React, { useState,useEffect } from "react";
  import { Link , useNavigate} from "react-router-dom";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  // import { initHomeScripts } from "./main";
  import axios from "axios";
  import "./style.css";
  import Header from "./components/Header";
  import Footer from "./components/Footer";

  const Myaccount = () => {
    
    /* ===================== AUTH CHECK ===================== */
    const token = localStorage.getItem("token");
    // const email = localStorage.getItem("email");
    const username = localStorage.getItem("username") || "Guest User";
    const isLoggedIn = !!token;
    // --------------------
      // USER-SPECIFIC KEY
      // ------------------
      const wishlistKey = username ? `wishlist_${username}` : null;
      // USER-SPECIFIC CART KEY
      const cartKey = username ? `cart_${username}` : null;
        // states
        const navigate = useNavigate();
        const [searchTerm, setSearchTerm] = useState("");
        const [wishlist, setWishlist] = useState([]);
          // Cart state (for count)
        const [cart, setCart] = useState([]);
        // Init scripts and load wishlist once
        const [dashboard, setDashboard] = useState({
          totalOrders: 0,
          wishlist: 0,
          totalSpent: 0
        }); 
        const [orders, setOrders] = useState([]);
        const [address, setAddress] = useState(null);
        const [isEditingAddress, setIsEditingAddress] = useState(false);
        const [formAddress, setFormAddress] = useState({
          firstname: "",
          lastname:"",
          email:"",
          mobile: "",
          address: "",
          city: "",
          state: "",
          country: "",
          zip: ""
        });
        useEffect(() => {
          if (address) {
            setFormAddress(address);
          }
        }, [address]);

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
      const handleSaveAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          "http://localhost:5000/api/address",
          formAddress,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert(res.data.message);

        setAddress(formAddress);        // update UI
        setIsEditingAddress(false);     // close form

      } catch (err) {
        console.log(err);
        alert("Failed to save address");
      }
    };
      useEffect(() => {
        const fetchDashboard = async () => {
          try {
            if (!token) return;

            const res = await fetch(
              "http://localhost:5000/api/dashboard",
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            const data = await res.json();

            if (res.ok) {
              setDashboard({
                totalOrders: data.totalOrders || 0,
                totalSpent: data.totalSpent || 0,
                wishlist: wishlist.length
              });
            } else {
              console.log("Dashboard API Error:", data);
            }
          } catch (err) {
            console.log("Dashboard Error:", err);
          }
        };

        fetchDashboard();
      }, [token, wishlist.length]);

          // orders tab
          

          useEffect(() => {
            const fetchOrders = async () => {
              try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:5000/api/myorders", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                });

                const data = await res.json();
                console.log("Orders API Data:", data); // 👈 ADD THIS

                if (res.ok) {
                  setOrders(data);
                } else {
                  console.log("Orders error:", data);
                }
              } catch (err) {
                console.log("Orders fetch error:", err);
              }
            };

            fetchOrders();
          }, []);


          // wishlist
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
          
          // view button code for orders tab
          const handleView = async (productId) => {

          if (!productId) {
            alert("Product ID not found");
            return;
          }
          navigate(`/product/${productId}`);
        };

  /* ========================update user account=======================*/
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {

  const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/getuser",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((res)=>{

    setFirstname(res.data.firstname);
    setLastname(res.data.lastname);
    setMobile(res.data.mobile);
    setEmail(res.data.email);

    })
    .catch((err)=>{
    console.log(err);
    });

    },[]);

  const handleUpdateAccount = (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    axios.post(
      "http://localhost:5000/updateuseraccount",
      {
        firstname,
        lastname,
        email,
        mobile,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      alert(res.data.message);
    })
    .catch((err) => {
      alert("Update failed");
    });
  };
  /* ========================change password code==============*/
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async (e) => {
      e.preventDefault();

      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          "http://localhost:5000/user-change-password",
          { currentPassword, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert(response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        alert(error.response?.data?.message || "Password change failed");
      }
    };
    /* ===================== LOGOUT ===================== */
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login";
    };
    

    return (
    <div>

      {/* ================= TOP BAR ================= */}
      <div className="top-bar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <i className="fa fa-envelope"></i> support@email.com
            </div>
            <div className="col-sm-6 text-end">
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

        {/* Bottom Bar start */}
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
        {/* { Bottom Bar ends} */}
        {/* ================= PROFILE HEADER ================= */}
        <div className="container mt-4">
          <div className="card shadow-sm">
            <div className="card-body d-flex align-items-center">
              {/* <img
                src="https://i.pravatar.cc/80"
                alt="profile"
                className="rounded-circle me-3"
              /> */}
              <div className="me-3">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: 60, height: 60, fontSize: 24 }}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h5 className="mb-0">Hello, {username}</h5>
                <small className="text-muted">Manage your account & orders</small>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ACCOUNT BODY ================= */}
        <div className="container mt-4">
          <div className="row">

          {/* <!-- My Account Start --> */}
          <div className="my-account">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-3">
                    <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                        <Link className="nav-link active" id="dashboard-nav" data-bs-toggle="pill" data-bs-target="#dashboard-tab"><i className="fa fa-tachometer-alt"></i>Dashboard</Link>
                        <Link className="nav-link" id="orders-nav" data-bs-toggle="pill" data-bs-target="#orders-tab"><i className="fa fa-shopping-bag"></i>Orders</Link>
                        <Link className="nav-link" id="payment-nav" data-bs-toggle="pill" data-bs-target="#payment-tab"><i className="fa fa-credit-card"></i>Payment Method</Link>
                        <Link className="nav-link" id="address-nav" data-bs-toggle="pill" data-bs-target="#address-tab"><i className="fa fa-map-marker-alt"></i>address</Link>
                        <Link className="nav-link" id="account-nav" data-bs-toggle="pill" data-bs-target="#account-tab"><i className="fa fa-user"></i>Account Details</Link>
                        <Link className="nav-link btn btn-link text-start" onClick={handleLogout}>
                          <i className="fa fa-sign-out-alt"></i> Logout
                        </Link>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="dashboard-tab">
                            <h4>Dashboard</h4>
                            <div className="row">
                              <div className="col-md-4">
                                <div className="card text-center shadow-sm">
                                  <div className="card-body">
                                    <i className="fa fa-shopping-cart fa-2x text-primary mb-2"></i>
                                    <h6>Total Orders</h6>
                                    <h3>{dashboard.totalOrders}</h3>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div className="card text-center shadow-sm">
                                  <div className="card-body">
                                    <i className="fa fa-heart fa-2x text-danger mb-2"></i>
                                    <h6>Wishlist</h6>
                                    <h3>{dashboard.wishlist}</h3>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div className="card text-center shadow-sm">
                                  <div className="card-body">
                                    <i className="fa fa-wallet fa-2x text-success mb-2"></i>
                                    <h6>Total Spent</h6>
                                    <h3>${dashboard.totalSpent}</h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="orders-tab">
                          <h4>My Orders</h4>

                          {orders.length === 0 ? (
                            <p>No orders found.</p>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead className="table-dark">
                                  <tr>
                                    <th>Order Id</th>
                                    <th>Product</th>
                                    <th>Date</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.map((order) => (
                                    <tr key={order.orderId}>
                                      <td>{order.orderId}</td>
                                      <td>{order.products}</td>
                                      <td>
                                        {order.orderdate
                                          ? new Date(order.orderdate).toLocaleDateString("en-GB", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                            })
                                          : new Date().toLocaleDateString("en-GB", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                            })}
                                        
                                      </td>
                                      <td>${order.price}</td>
                                      <td>
                                        <span
                                          className={`badge ${
                                            order.status === "Approved"
                                              ? "bg-success"
                                              : order.status === "Pending"
                                              ? "bg-warning"
                                              : "bg-secondary"
                                          }`}
                                        >
                                          {order.status || "pending"}
                                        </span>
                                      </td>
                                      
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      
                        
                        <div className="tab-pane fade" id="payment-tab">
                          <h4 className="mb-4">Payment Methods</h4>

                          <div className="row">

                            {/* Saved Cards */}
                            <div className="col-md-6 mb-3">
                              <div className="card shadow-sm">
                                <div className="card-body">
                                  <h6 className="mb-3">
                                    <i className="fa fa-credit-card me-2"></i>
                                    Saved Cards
                                  </h6>

                                  <div className="border p-3 mb-2 rounded">
                                    <strong>Visa Card</strong>
                                    <p className="mb-1">**** **** **** 4521</p>
                                    <small className="text-muted">Expiry: 05/28</small>
                                    <div className="mt-2">
                                      <button className="btn btn-sm btn-outline-primary me-2">
                                        Make Default
                                      </button>
                                      <button className="btn btn-sm btn-outline-danger">
                                        Remove
                                      </button>
                                    </div>
                                  </div>

                                  <button className="btn btn-sm btn-dark mt-2">
                                    + Add New Card
                                  </button>

                                </div>
                              </div>
                            </div>


                            {/* UPI Method */}
                            <div className="col-md-6 mb-3">
                              <div className="card shadow-sm">
                                <div className="card-body">
                                  <h6 className="mb-3">
                                    <i className="fa fa-mobile-alt me-2"></i>
                                    UPI Payment
                                  </h6>

                                  <div className="border p-3 mb-2 rounded">
                                    <strong>UPI ID</strong>
                                    <p className="mb-1">ram@paytm</p>

                                    <div className="mt-2">
                                      <button className="btn btn-sm btn-outline-primary me-2">
                                        Edit
                                      </button>
                                      <button className="btn btn-sm btn-outline-danger">
                                        Remove
                                      </button>
                                    </div>
                                  </div>

                                  <button className="btn btn-sm btn-dark mt-2">
                                    + Add UPI
                                  </button>

                                </div>
                              </div>
                            </div>


                            {/* Wallet */}
                            <div className="col-md-6 mb-3">
                              <div className="card shadow-sm">
                                <div className="card-body">
                                  <h6 className="mb-3">
                                    <i className="fa fa-wallet me-2"></i>
                                    Wallet
                                  </h6>

                                  <div className="border p-3 rounded">
                                    <strong>PayPal</strong>
                                    <p className="mb-1">ram@email.com</p>

                                    <button className="btn btn-sm btn-outline-danger">
                                      Disconnect
                                    </button>
                                  </div>

                                </div>
                              </div>
                            </div>


                            {/* COD Option */}
                            <div className="col-md-6 mb-3">
                              <div className="card shadow-sm">
                                <div className="card-body">
                                  <h6 className="mb-3">
                                    <i className="fa fa-truck me-2"></i>
                                    Cash On Delivery
                                  </h6>

                                  <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox"/>
                                    <label className="form-check-label">
                                      Enable Cash On Delivery
                                    </label>
                                  </div>

                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                        <div className="tab-pane fade" id="address-tab">
                          <h4>Address</h4>

                          <div className="row">

                            {/* ✅ NO ADDRESS */}
                            {!address && !isEditingAddress && (
                              <div className="col-md-6">
                                <p>No address found</p>

                                <button 
                                  className="btn btn-dark"
                                  onClick={() => setIsEditingAddress(true)}
                                >
                                  + Add Address
                                </button>
                              </div>
                            )}

                            {/* ✅ ADD / EDIT FORM */}
                            {isEditingAddress && (
                              <div className="col-md-6">

                                <input type="text" className="form-control mb-2" placeholder="First Name"
                                  value={formAddress.firstname}
                                  onChange={(e)=>setFormAddress({...formAddress, firstname:e.target.value})}
                                />
                                <input type="text" className="form-control mb-2" placeholder="Last Name"
                                  value={formAddress.lastname}
                                  onChange={(e)=>setFormAddress({...formAddress, lastname:e.target.value})}
                                />
                                <input type="email" className="form-control mb-2" placeholder="email"
                                  value={formAddress.email}
                                  onChange={(e)=>setFormAddress({...formAddress, email:e.target.value})}
                                />

                                <input type="text" className="form-control mb-2" placeholder="Mobile"
                                  value={formAddress.mobile}
                                  onChange={(e)=>setFormAddress({...formAddress, mobile:e.target.value})}
                                />

                                <input type="text" className="form-control mb-2" placeholder="Address"
                                  value={formAddress.address}
                                  onChange={(e)=>setFormAddress({...formAddress, address:e.target.value})}
                                />

                                <input type="text" className="form-control mb-2" placeholder="City"
                                  value={formAddress.city}
                                  onChange={(e)=>setFormAddress({...formAddress, city:e.target.value})}
                                />

                                <input type="text" className="form-control mb-2" placeholder="State"
                                  value={formAddress.state}
                                  onChange={(e)=>setFormAddress({...formAddress, state:e.target.value})}
                                />

                                <input type="text" className="form-control mb-2" placeholder="Country"
                                  value={formAddress.country}
                                  onChange={(e)=>setFormAddress({...formAddress, country:e.target.value})}
                                />

                                <input type="text" className="form-control mb-2" placeholder="ZIP Code"
                                  value={formAddress.zip}
                                  onChange={(e)=>setFormAddress({...formAddress, zip:e.target.value})}
                                />

                                <button className="btn btn-success me-2" onClick={handleSaveAddress}>
                                  Save Address
                                </button>

                                <button className="btn btn-secondary" onClick={() => setIsEditingAddress(false)}>
                                  Cancel
                                </button>

                              </div>
                            )}

                            {/* ✅ SHOW ADDRESS */}
                            {address && !isEditingAddress && (
                              <div className="col-md-6">

                                <p>
                                  {address.firstname} {address.lastname}<br/>
                                  {address.email}<br/>

                                  {address.address}, {address.city}, {address.state}<br/>
                                  {address.country} - {address.zip}
                                </p>

                                <p>Mobile: {address.mobile}</p>

                                <button 
                                  className="btn btn-primary"
                                  onClick={() => setIsEditingAddress(true)}
                                >
                                  Edit Address
                                </button>

                              </div>
                            )}

                          </div>
                        </div>
                        <div className="tab-pane fade" id="account-tab">
                            <h4>Account Details</h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <input className="form-control" type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="First Name"/>
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Last Name"/>
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile"/>
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                                </div>
                                <div className="col-md-12">
                                    <button className="btn" onClick={handleUpdateAccount}>Update Account</button>
                                    <br/><br/>
                                </div>
                            </div>
                            <h4>Password change</h4>
                            <div className="row">
                                <div className="col-md-12">
                                    <input className="form-control" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password"/>
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password"/>
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}placeholder="Confirm Password"/>
                                </div>
                                <div className="col-md-12">
                                    <button className="btn" onClick={handleChangePassword}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- My Account End --> */}
          </div>
        </div>
         {/* Footer start*/}
        <Footer/>
    </div>
    );
  };

  export default Myaccount;
