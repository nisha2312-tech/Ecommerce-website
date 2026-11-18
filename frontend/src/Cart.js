import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "font-awesome/css/font-awesome.min.css";

import { initHomeScripts } from "./main";
import "./style.css";
import { CartContext } from "./context/CartContext";
import { WishlistContext } from "./context/WishlistContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

const Cart = () => {

   const navigate = useNavigate();
    // Auth
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;

  const { wishlist, setWishlist } = useContext(WishlistContext);
  const { cart, setCart } = useContext(CartContext);
  // Init scripts and load wishlist once
    

  
    // Remove from cart

  const removeFromCart = (id, size, color) => {
  if (!window.confirm("Remove this item from cart?")) return;

  const updatedCart = cart.filter(
    (item) =>
      !(
        item.id === id &&
        item.size === size &&
        item.color === color
      )
  );

  setCart(updatedCart);
};
  //update quantity
  const updateQuantity = (id, amount) => {
  const updatedCart = cart.map((item) =>
    item.id === id
      ? {
          ...item,
          quantity: Math.max(1, item.quantity + amount),
        }
      : item
  );

  setCart(updatedCart);
};

  // subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // Shipping charge
    const shippingCost = cart.length > 0 ? 5 : 0; // $5 if cart is not empty, otherwise $0
  //Grand total
    const grandTotal = subtotal + shippingCost; 

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div>
      <Header/>
      
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
                        Shipping Cost : <span>${shippingCost}</span>
                      </p>
                      <h1>
                        Grand Total : <span>${grandTotal}</span>
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
      {/* <a href="#" className="back-to-top">
        <i className="fa fa-chevron-up"></i>
      </a> */}
      <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          ><i className="fa fa-chevron-up"></i></button>
      
    </div>
  );
};

export default Cart;
