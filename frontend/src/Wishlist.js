import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { initHomeScripts } from "./main";
import "./style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Wishlist = () => {
  // --------------------
  // AUTH
  // --------------------
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;
  // const [product, setProduct] = useState(null);
  // const [products, setProducts] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
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
  // fetch products
    // useEffect(() => {
    //     axios.get("http://localhost:5000/api/products") // change URL if needed
    //       .then(res => {
    //         setProducts(res.data);
    //         setTimeout(() => {
    //         // initHomeScripts(); // re-init slider
    //       }, 100);
    //       })
    //       .catch(err => {
    //         console.error("Error fetching products:", err);
    //       });
    //   }, []);
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
  
    // // Add/remove product from wishlist
    // const toggleWishlist = (product) => {
    //   if(!wishlistKey) {
    //     alert("Please login to use wishlist");
    //     return;
    //   }
    //   let newWishlist;
    //   if (wishlist.some((p) => p.id === product.id)) {
    //     // Remove if already in wishlist
    //     newWishlist = wishlist.filter((p) => p.id !== product.id);
    //   } else {
    //     // Add if not in wishlist
    //     newWishlist = [...wishlist, product];
    //   }
    //   setWishlist(newWishlist);
    //   localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
    // };
  
    // // Check if product is in wishlist
    // const isInWishlist = (productId) => {
    //   return wishlist.some((p) => p.id === productId);
    // };
  // --------------------
  // // LOAD USER WISHLIST
  // // --------------------
  // useEffect(() => {
  //   if (!wishlistKey) {
  //     setWishlist([]);
  //     return;
  //   }

  //   const storedWishlist =
  //     JSON.parse(localStorage.getItem(wishlistKey)) || [];
  //   setWishlist(storedWishlist);
  // }, [wishlistKey]);

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
  // Searching
    //   const filteredProducts = products.filter((product) => {
    //   const matchesSearch =
    //     product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     product.description.toLowerCase().includes(searchTerm.toLowerCase());
    //     console.log(product.category_id, typeof product.category_id);

      
    //   const matchesCategory =
    //   !selectedCategory || product.category_id === selectedCategory;

    //   return matchesSearch && matchesCategory;
    // });
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
