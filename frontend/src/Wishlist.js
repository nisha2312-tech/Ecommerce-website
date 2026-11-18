import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { initHomeScripts } from "./main";
import "./style.css";
import { CartContext } from "./context/CartContext";
import { WishlistContext } from "./context/WishlistContext";

import Header from "./components/Header";
import Footer from "./components/Footer";


const Wishlist = () => {
  // --------------------
  // AUTH
  // --------------------
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { wishlist, setWishlist } = useContext(WishlistContext);
  const { cart, setCart } = useContext(CartContext);
  // --------------------
  // REMOVE ITEM
  // --------------------
  const handleRemove = (id) => {
  const newWishlist = wishlist.filter((p) => p.id !== id);

  setWishlist(newWishlist);

  // update localStorage also
  const wishlistKey = `wishlist_${username}`;
  localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
  };


  // add to cart button code

    const addToCart = (product) => {
    // if (!cartKey){
    //   alert("Please Login First");
    //   return;
    // }

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
    // localStorage.setItem(cartKey, JSON.stringify(newCart));
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
      <Header />
      
        {/* <!-- Breadcrumb Start --> */}
        <div className="breadcrumb-wrap">
          <div className="container-fluid">
              <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/Products">Products</Link></li>
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
      
      {/* Footer start */}
      <Footer/>
        
        {/* Back to Top */}
        {/* <a href="#" className="back-to-top"><i className="fa fa-chevron-up"></i></a> */}
          <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          ><i className="fa fa-chevron-up"></i></button>
    </div>
  );
};

export default Wishlist;
