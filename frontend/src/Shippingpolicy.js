import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { initHomeScripts } from "./main";
import "./style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Shippingpolicy = () => {
    useEffect(() => {
          initHomeScripts();
        }, []);
    
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
    
      // States
      const [products, setProducts] = useState([]);
      const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState("");
      const [currentPage, setCurrentPage] = useState(1);
      const [wishlist, setWishlist] = useState([]);
      // Cart state (for count)
      const [cart, setCart] = useState([]); 
    
      const ITEMS_PER_PAGE = 8;
    
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
    
      //   const storedWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      //   setWishlist(storedWishlist);
      // }, [wishlistKey]);
    
      // Fetch products
      useEffect(() => {
        axios
          .get("http://localhost:5000/api/products")
          .then((res) => setProducts(res.data))
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      }, []);
    
      // Fetch categories
      useEffect(() => {
        axios
          .get("http://localhost:5000/api/category")
          .then((res) => setCategories(res.data))
          .catch((err) => console.error("Error fetching categories:", err));
      }, []);
    
      if (loading) return <div className="text-center my-5">Loading products...</div>;
      if (error) return <div className="text-center text-danger my-5">{error}</div>;
    
      // Filtered products
      const filteredProducts = products.filter(
        (product) =>
          product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      // Pagination
      const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
      
    
      const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/login";
      };
    
      // Add/remove product from wishlist
      const toggleWishlist = (product) => {
        if(!wishlistKey) return;
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
        if (!cartKey) return;
    
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
      };
      return (
      <div>
        <Header/>

        {/* Breadcrumb Start */}
        <div className="breadcrumb-wrap">
          <div className="container-fluid">
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Shipping policy</li>
            </ul>
          </div>
        </div>
        {/* Breadcrumb End */}
            <div className="about">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            
                        </div>
                        {/* <div className="col-lg-3 about-left">
                            

                            <img src="images/slider-1.jpg"/>
                        </div> */}
                        <div className="col-lg-12">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, </p>
                        </div>
                        <div className="col-lg-12">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, </p>
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, </p>
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
  )};
  export default Shippingpolicy;
