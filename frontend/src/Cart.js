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
