import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
import { Link,NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import "slick-carousel/slick/slick.min.js";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";



    const HomePage = () => {
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
    // states
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sliders, setSliders] = useState([]);
    // const [brands, setBrands] = useState([]);
    const [partners, setPartners] = useState([]);
    const [wishlist, setWishlist] = useState([]);
      // Cart state (for count)
    const [cart, setCart] = useState([]);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const categoryIcons = {
      1: "fa-solid fa-person-dress",
      2: "fa-solid fa-person",
      3: "fa-solid fa-shirt",
      4: "fa-basket-shopping",
      5: "fa-house",
      6: "fa-solid fa-laptop",
      7: "fa-solid fa-child-reaching",
      8: "fa-solid fa-mobile-screen"

    };
    //Get Category from URL
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryFromURL = params.get("category");

        if (categoryFromURL) {
          setSelectedCategory(categoryFromURL);
        } else {
          setSelectedCategory(null);
        }

        setCurrentPage(1);
      }, [location.search]);




    // Init scripts and load wishlist once
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
        const addToCart = (product) => {
        if (!cartKey){
          alert("please login first") 
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

      useEffect(() => {
        axios.get("http://localhost:5000/api/products") // change URL if needed
          .then(res => {
            setProducts(res.data);
            setTimeout(() => {
            // initHomeScripts(); // re-init slider
          }, 100);
          })
          .catch(err => {
            console.error("Error fetching products:", err);
          });
      }, []);

      // Searching
      const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
        console.log(product.category_id, typeof product.category_id);

      
      const matchesCategory =
      !selectedCategory || product.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Fetch categories
    useEffect(() => {
      axios
        .get("http://localhost:5000/api/category")
        .then((res) => setCategories(res.data))
        .catch((err) => console.error("Error fetching categories:", err));
    }, []);
    // add slider

    useEffect(() => {
    axios
      .get("http://localhost:5000/api/slider")
      .then(res => setSliders(res.data))
      .catch(err => console.error("Slider error:", err));
  }, []);

    useEffect(() => {
    axios
      .get("http://localhost:5000/api/partners")
      .then((res) => setPartners(res.data))
      .catch((err) => console.error("Error fetching partners:", err));
  }, []);
  // Newsletter 
  const handleSubmit = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      alert(data.message);
      
      if (response.ok) {
        setEmail("");
      } else {
      
      }
    } catch (error) {
      alert("Server error")
      
    }
  };

  // Sliders
  if (sliders.length === 0) return null;
  const headerSliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true
};
const productSliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } }
  ]
};
const partnerSliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: { slidesToShow: 5 }
    },
    {
      breakpoint: 992,
      settings: { slidesToShow: 4 }
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 3 }
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 2 }
    }
  ]
};
const reviewSliderSettings = {
  autoplay: true,
  autoplaySpeed: 3000,
  dots: true,
  arrows: false,
  infinite: true,
  speed: 800,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1
      }
    }
  ]
  
};

  return (
    <div>
      {/* <Header /> */}

        {/* Top Bar */}
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
                {/* <div className="navbar-nav mr-auto">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `nav-item nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/Products"
                    className={({ isActive }) =>
                      `nav-item nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Shop
                  </NavLink>

                  <NavLink
                    to="/Aboutus"
                    className={({ isActive }) =>
                      `nav-item nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    About Us
                  </NavLink>

                  <NavLink
                    to="/Myaccount"
                    className={({ isActive }) =>
                      `nav-item nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    My Account
                  </NavLink>

                  <NavLink
                    to="/Contactus"
                    className={({ isActive }) =>
                      `nav-item nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Contact Us
                  </NavLink>
                </div> */}
  
                
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

      {/* Header Section (slider + categories) */}
      <div className="header">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar Menu */}
            <div className="col-md-3">
              <nav className="navbar bg-light">
                  <ul className="navbar-nav">
                    {/* All Categories */}
                    {/* <li className="nav-item">
                      
                      <button
                        className={`nav-link btn btn-category ${
                          !selectedCategory ? "fw-bold" : ""
                        }`}
                        onClick={() => {
                          setSelectedCategory(null);  
                          setCurrentPage(1);
                        }}
                      >
                        All Categories
                      </button>
                    </li> */}

                    {categories.map((cat) => (
                      <li className="nav-item" key={cat.id}>
                        <Link to={`/products?category=${cat.id}`}
                          className={`nav-link ${
                            selectedCategory === cat.id ? "fw-bold" : ""
                          }`}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setCurrentPage(1);
                          }}
                        >
                          {/* <i className={`fa ${cat.icon || "fa-tag"}`}></i> {cat.name} */}
                          <i className={`fa ${categoryIcons[cat.id] || "fa-tag"}`}></i> {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                {/* <ul className="navbar-nav">
                  {categories.map((cat) => (
                    <li className="nav-item" key={cat.id}>
                      <Link
                        to={`/products?category=${cat.id}`}
                        className="nav-link"
                      >
                        <i className={`fa ${cat.icon || "fa-tag"}`}></i> {cat.name}
                      </Link>
                    </li>
                  ))}

                </ul> */}
              </nav>
            </div>

            {/* Slider */}
            
          <div className="col-md-6">
              {/* <div className="header-slider normal-slider">
                {sliders.map(slide => (
                <div className="header-slider-item" key={slide.id}>
                  <img
                    src={`http://localhost:5000/${slide.image}`}
                    alt={slide.title}
                  />

                  <div className="header-slider-caption">
                    <p>{slide.description}</p>
                    
                    <Link className="btn" to="/products">
                      <i className="fa fa-shopping-cart"></i> Shop Now
                    </Link>
                  </div>
                </div>
              ))}
              </div> */}
              <div className="header-slider">
              <Slider {...headerSliderSettings}>
                {sliders.map(slide => (
                  <div className="header-slider-item" key={slide.id}>
                    <img
                      src={`http://localhost:5000/${slide.image}`}
                      alt={slide.title}
                    />

                    <div className="header-slider-caption">
                      <p>{slide.description}</p>
                      <Link className="btn" to="/products">
                        <i className="fa fa-shopping-cart"></i> Shop Now
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>
              </div>

            </div>



            {/* Category Images */}
            <div className="col-md-3">
              <div className="header-img">
                  {filteredProducts
                  .filter(product => product.displayorder === 12)
                  .map(product => (
                    <div className="img-item"  key={product.id}>
                      <img src={`http://localhost:5000/${product.image}`}
                        alt={product.description}/>
                        <Link className="img-text" to={`/product/${product.id}`}>
                          <p>{product.productname}</p>
                        </Link>
                      
                    </div>
                   ))}
                   {filteredProducts
                  .filter(product => product.displayorder === 13)
                  .map(product => (
                    <div className="img-item"  key={product.id}>
                      <img src={`http://localhost:5000/${product.image}`}
                        alt={product.description}/>
                        <Link className="img-text" to={`/product/${product.id}`}>
                          <p>{product.productname}</p>
                        </Link>
                      
                    </div>
                   ))}
              </div>
                
            </div>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="brand">
        <div className="container-fluid">
          <Slider {...partnerSliderSettings}>
            {partners && partners.length > 0 ? (
              partners.map((partner) => (
                <div className="brand-item" key={partner.id}>
                  <img
                    src={`http://localhost:5000/${partner.image}`}
                    alt={`partner ${partner.id}`}
                  />
                </div>
              ))
            ) : (
              <p>Loading partners...</p>
            )}
         </Slider>  
        </div>
      </div>


      {/* Feature Section */}
      <div className="feature">
        <div className="container-fluid">
          <div className="row align-items-center">
            {[
              ["fa fa-cc-mastercard", "Secure Payment"],
              ["fa fa-truck", "Worldwide Delivery"],
              ["fa fa-exchange", "90 Days Return"],
              ["fa fa-comments", "24/7 Support"],
            ].map(([icon, title], i) => (
              <div className="col-lg-3 col-md-6 feature-col" key={i}>
                <div className="feature-content">
                  <i className={icon}></i>
                  <h2>{title}</h2>
                  <p>Lorem ipsum dolor sit amet consectetur elit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      { /* category section */}
      <div className="category">
      <div className="container-fluid">
        <div className="row">
          
          {/* Column 1 */}
            {products
              .filter(product => product.displayorder === 1)
              .map(product => (
                <div className="col-md-3" key={product.id}>
                  <div className="category-item ch-400">
                    <img src={`http://localhost:5000/${product.image}`} alt={product.description}/>
                    <Link className="category-name" to={`/product/${product.id}`}>
                      <p>{product.productname}</p>
                    </Link>
                  </div>
                </div>
            ))}

          

          {/* Column 2 */}
          <div className="col-md-3">
            {filteredProducts
              .filter(product => product.displayorder === 2)
              .map(product => (
            <div className="category-item ch-250" key={product.id}>
               <img src={`http://localhost:5000/${product.image}`} alt={product.description}/>
              <Link className="category-name" to={`/product/${product.id}`}>
                <p>{product.productname}</p>
              </Link>
            </div>
              ))}
            {products
              .filter(product => product.displayorder === 3)
              .map(product => (
              <div className="category-item ch-150" key={product.id}>
                <img src={`http://localhost:5000/${product.image}`} alt={product.description}/>
                <Link className="category-name" to={`/product/${product.id}`}>
                  <p>{product.productname}</p>
                </Link>
              </div>
              ))}
          </div>

          {/* Column 3 */}
          <div className="col-md-3">
            {products
              .filter(product => product.displayorder === 4)
              .map(product => (
            <div className="category-item ch-150" key={product.id}>
               <img src={`http://localhost:5000/${product.image}`} alt={product.description}/>
              <Link className="category-name" to={`/product/${product.id}`}>
                <p>{product.productname}</p>
              </Link>
            </div>
              ))}
            {products
              .filter(product => product.displayorder === 5)
              .map(product => (
              <div className="category-item ch-250" key={product.id}>
                <img src={`http://localhost:5000/${product.image}`} alt={product.description}/>
                <Link className="category-name" to={`/product/${product.id}`}>
                  <p>{product.productname}</p>
                </Link>
              </div>
            ))}
            </div>
          {/* //   <div className="category-item ch-150">
          //     <img src="images/category-6.jpg" alt="Category" />
          //     <a className="category-name" href="#">
          //       <p>Some text goes here that describes the image</p>
          //     </a>
          //   </div>
          //   <div className="category-item ch-250">
          //     <img src="images/category-7.jpg" alt="Category" />
          //     <a className="category-name" href="#">
          //       <p>Some text goes here that describes the image</p>
          //     </a>
          //   </div>
          // </div> */}

          {/* Column 4 */}
           {products
              .filter(product => product.displayorder === 6)
              .map(product => (
                <div className="col-md-3" key={product.id}>
                  <div className="category-item ch-400">
                    <img src={`http://localhost:5000/${product.image}`} alt={product.description}/>
                    <Link className="category-name" to={`/product/${product.id}`}>
                      <p>{product.productname}</p>
                    </Link>
                  </div>
                </div>
            ))}
        </div>
      </div>
    </div>
      {/* Call to Action */}
      <div className="call-to-action">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>Call us for any queries</h1>
            </div>
            <div className="col-md-6">
              <a href="tel:0123456789">+012-345-6789</a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="featured-product product">
        <div className="container-fluid">
          <div className="section-header">
            <h1>Featured Product</h1>
          </div>
          <div className="row align-items-center product-slider product-slider-4">
            <Slider {...productSliderSettings}>
              {filteredProducts.map((product) => (
              <div className="col-lg-3" key={product.id}>
                <div className="product-item">
                  <div className="product-title">
                    <Link to={`/product/${product.id}`}>
                      {product.productname}
                    </Link>
                    <div className="ratting">
                      {Array(5).fill().map((_, i) => (
                        <i className="fa fa-star" key={i}></i>
                      ))}
                    </div>
                  </div>

                  <div className="product-image">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={`http://localhost:5000/${product.image}`}
                        alt={product.productname}
                      />
                    </Link>

                    <div className="product-action">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => toggleWishlist(product)}
                      >
                        <i
                          className={`fa ${
                            isInWishlist(product.id) ? "fa-heart" : "fa-heart-o"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="product-price">
                    <h3>
                      <span>$</span>{product.price}
                    </h3>
                    <button
                          className="btn btn-primary"
                          onClick={() => addToCart(product)}
                        >
                          <i className="fa fa-shopping-cart"></i> Add to Cart
                        </button>
                  </div>

                </div>
              </div>
            ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <h1>Subscribe Our Newsletter</h1>
            </div>
            <div className="col-md-6">
              <div className="form">
                <input
                type="email"
                placeholder="Your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
                <button onClick={handleSubmit}>Submit</button>
              </div>
              {message && <p>{message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="recent-product product">
        <div className="container-fluid">
          <div className="section-header">
            <h1>Recent Product</h1>
          </div>
          <div className="row align-items-center product-slider product-slider-4">
            <Slider {...productSliderSettings}>
              {filteredProducts.map((product) => (
                <div className="col-lg-3" key={product.id}>
                  <div className="product-item">
                    <div className="product-title">
                      <Link to={`/product/${product.id}`}>
                        {product.productname}
                      </Link>
                      <div className="ratting">
                        {Array(5).fill().map((_, i) => (
                          <i className="fa fa-star" key={i}></i>
                        ))}
                      </div>
                    </div>

                    <div className="product-image">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={`http://localhost:5000/${product.image}`}
                          alt={product.productname}
                        />
                      </Link>

                      <div className="product-action">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => toggleWishlist(product)}
                        >
                          <i
                            className={`fa ${
                              isInWishlist(product.id) ? "fa-heart" : "fa-heart-o"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </div>

                    <div className="product-price">
                      <h3>
                        <span>$</span>{product.price}
                      </h3>
                      <button
                          className="btn btn-primary"
                          onClick={() => addToCart(product)}
                        >
                          <i className="fa fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>

                  </div>
                </div>
               ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="review">
        <div className="container-fluid">
          <div className="row align-items-center review-slider normal-slider">
            <Slider {...reviewSliderSettings} className="review-slider normal-slider">
            <div className="col-md-6">
              <div className="review-slider-item">
                  <div className="review-img">
                      <img src="images/review-1.jpg" alt="Image"/>
                  </div>
                  <div className="review-text">
                      <h2>Jasmeen</h2>
                      <h3>Profession</h3>
                      <div className="ratting">
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                      </div>
                      <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nunc eget leo finibus luctus et vitae lorem
                      </p>
                  </div>
              </div>
            </div>
            <div className="col-md-6">
                <div className="review-slider-item">
                    <div className="review-img">
                        <img src="images/review-2.jpg" alt="Image"/>
                    </div>
                    <div className="review-text">
                        <h2>Henry</h2>
                        <h3>Profession</h3>
                        <div className="ratting">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nunc eget leo finibus luctus et vitae lorem
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="review-slider-item">
                    <div className="review-img">
                        <img src="images/review-3.jpg" alt="Image"/>
                    </div>
                    <div className="review-text">
                        <h2>Alen</h2>
                        <h3>Profession</h3>
                        <div className="ratting">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nunc eget leo finibus luctus et vitae lorem
                        </p>
                    </div>
                </div>
            </div> 
            </Slider> 
          </div>
          
        </div>
      </div>
      {/* Footer start */}
      <Footer/>

      {/* Back To Top */}
      <a href="#" className="back-to-top">
        <i className="fa fa-chevron-up"></i>
      </a>
    </div>
    
    
  );
};
export default HomePage;
