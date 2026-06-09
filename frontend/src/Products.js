import React, { useEffect, useState } from "react";
import { Link,useLocation} from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { initHomeScripts } from "./main";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import "./style.css";

const Products = () => {
  const categoryIcons = {
      1: "fa-solid fa-person-dress",
      2: "fa-solid fa-person",
      3: "fa-solid fa-spa",
      4: "fa-basket-shopping",
      5: "fa-house",
      6: "fa-solid fa-laptop",
     
      7: "fa-solid fa-mobile-screen",
      8: "fa-solid fa-kitchen-set"
      

    };
  // const brandIcons = {
  //     1: "fa-solid fa-shoe-prints",        // Nike
  //     2: "fa-solid fa-shoe-prints", // Puma (no official FA icon, closest match)
  //     3: "fa-solid fa-bars",        // Adidas (3 stripes vibe)
  //     4: "fa-solid fa-shoe-prints", // Red Tape
  //     5: "fa-solid fa-road",        // Roadster
  //     6: "fa-solid fa-user-tie"     // Allen Solly (formal wear feel)

  //   };

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
  // const { id } = useParams(); // 👈 get product id from URL
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  // Cart state (for count)
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxProductPrice, setMaxProductPrice] = useState(1000);
  const [sortOption, setSortOption] = useState("new");

  const ITEMS_PER_PAGE = 8;


  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromURL = params.get("category");

    if (categoryFromURL) {
      setSelectedCategory(Number(categoryFromURL));
    } else {
      setSelectedCategory(null);
    }
  }, [location.search]);

  // Compute dynamic max price
useEffect(() => {
  if (products.length > 0) {
    const prices = products.map(p => Number(p.price));
    const max = Math.max(...prices);

    setMaxProductPrice(max);
    setPriceRange([0, max]); // reset slider
  }
}, [products]);

// brands api
useEffect(() => {
  axios
    .get("http://localhost:5000/api/brand")
    .then((res) => setBrands(res.data))
    .catch((err) => console.error("Error fetching brands:", err));
}, []);

  

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
    if (!cartKey) {
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
  

  // Fetch products
  useEffect(() => {
    const params = {};
    if(selectedCategory) params.category_id = selectedCategory;
    axios
      .get(`http://localhost:5000/api/products`,{params})
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

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
  const filteredProducts = products
  .filter((product) => {
    const matchesSearch =
      product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      Number(product.price) >= priceRange[0] &&
      Number(product.price) <= priceRange[1];

    const matchesCategory =
      !selectedCategory || product.category_id === selectedCategory;

    const matchesBrand =
      !selectedBrand || product.brand_id === selectedBrand;


    return matchesSearch && matchesPrice && matchesCategory && matchesBrand;
  })
  .sort((a, b) => {
    if (sortOption === "low-high") {
      return Number(a.price) - Number(b.price);
    }
    if (sortOption === "high-low") {
      return Number(b.price) - Number(a.price);
    }
    // New Arrivals (latest first)
    return b.id - a.id;
  });
  
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

  

      return (
      <div>
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
                        <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value);setCurrentPage(1);}} />
                        <button>
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
                        <Link to="/Cart" className="btn cart">
                          <i className="fa fa-shopping-cart"></i>
                          <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                        </Link>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

        {/* Breadcrumb Start */}
        <div className="breadcrumb-wrap">
          <div className="container-fluid">
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item"><a href="#">Products</a></li>
              <li className="breadcrumb-item active">Product List</li>
            </ul>
          </div>
        </div>
        {/* Breadcrumb End */}

        


        {/* Product List Start */}
      
      <div className="product-view">

        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
            {/* filter start */}
            <div className="filter-wrap">
              <div className="container">
                <p><b>Filters</b></p>
                
                <select id="sort" value={sortOption} onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                >

                  <option value="new">New Arrivals</option>
                  <option value="low-high">Price--Low to High</option>
                  <option value="high-low">Price--High to Low</option>

                </select>
                <p className="sort">Sort By: &nbsp;</p>
              </div>
            </div>
             {/* filter end */}
            </div>
            <div className="col-lg-3 sidebar">
              <div className="sidebar-widget category">
                <h2 className="title">Categories</h2>
                <nav className="navbar bg-light">
                  <ul className="navbar-nav">
                    {/* All Categories */}
                    <li className="nav-item">
                      <button
                        className={`nav-link btn btn-category ${
                          !selectedCategory ? "fw-bold" : ""
                        }`}
                        onClick={() => {
                          setSelectedCategory(null);  
                          setSelectedBrand(null); // ✅ RESET BRAND
                          setCurrentPage(1);
                        }}
                      >
                        All Categories
                      </button>
                    </li>

                    {categories.map((cat) => (
                      <li className="nav-item" key={cat.id}>
                        <Link 
                          className={`nav-link ${
                            selectedCategory === cat.id ? "fw-bold" : ""
                          }`}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedBrand(null); // ✅ RESET BRAND
                            setCurrentPage(1);
                          }}
                        >
                          <i className={`fa ${categoryIcons[cat.id] || "fa-tag"}`}></i> {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="sidebar-widget category">
                <h2 className="title">Brands</h2>
                <nav className="navbar bg-light">
                  <ul className="navbar-nav">

                    {brands.map((brand) => (
                      <li className="nav-item" key={brand.id}>
                        <Link
                          className={`nav-link ${
                            selectedBrand === brand.id ? "fw-bold" : ""
                          }`}
                          onClick={() => {
                            setSelectedBrand(brand.id);
                            setSelectedCategory(null); // ✅ RESET CATEGORY
                            setCurrentPage(1);
                          }}
                        >
                          
                          <i className={`fa ${brand.icon || "fa-tag"}`}></i> {brand.name}
                          {/* <i className={`fa ${brandIcons[brand.id] || "fa-tag"}`}></i> {brand.name} */}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="sidebar-widget category sidebar-price">
                <h2 className="title">Price</h2>

                <div className="p-3">
                  <p className="mb-2">
                    <strong>
                      ${priceRange[0]} – ${priceRange[1]}
                    </strong>
                  </p>

                  <Slider
                    range
                    min={0}
                    max={maxProductPrice}
                    value={priceRange}
                    onChange={(value) => {
                      setPriceRange(value);
                      setCurrentPage(1);
                    }}
                    trackStyle={[{ backgroundColor: "#ff6f61" }]}
                    handleStyle={[
                      { borderColor: "#ff6f61" },
                      { borderColor: "#ff6f61" }
                    ]}
                  />
                </div>
              </div>

              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => {
                  setPriceRange([0, maxProductPrice]);
                  setSearchTerm("");
                  setSelectedCategory(null); // ADD THIS
                  setSelectedBrand(null); // ADD THIS
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </button>



            </div>
            {/* LEFT CONTENT */}
            <div className="col-lg-9">
              <div className="row">
                {currentProducts.map((product) => (
                  <div key={product.id} className="col-md-3 mb-4">
                    
                      <div className="product-item h-100">
                        <Link to={`/product/${product.id}`}>
                          <div className="product-image">
                            
                              <img
                                // src={product.image} // Ensure this path is correct
                                  src={`http://localhost:5000/${product.image}`}
                                alt={product.productname}
                                className="img-fluid" style={{ cursor: "pointer" }}
                              />
                            
                          
                              
                            <div className="product-action">
                              <button
                                  // disabled={!isLoggedIn}
                                  className={`btn ${
                                  isInWishlist(product.id) ? "btn-danger" :  "btn-outline-danger"}`}
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
                          
                          <div className="product-title">
                            <span>{product.productname}</span>
                          </div>
                        </Link>
                        
                        <div className="product-description">
                          <p>{product.description}</p>
                        </div>

                        <div className="product-price">
                          <h3>
                            <span>$</span>
                            {product.price}
                          </h3>
                          {/* <button className="btn btn-primary">
                            <i className="fa fa-shopping-cart"></i> Buy Now
                          </button> */}
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

              </div>
              {/* Pagination */}
              
              <div className="col-md-12">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    {/* <li className="page-item disabled"><a className="page-link">Previous</a></li>
                    <li className="page-item active"><a className="page-link">1</a></li>
                    <li className="page-item"><a className="page-link">2</a></li>
                    <li className="page-item"><a className="page-link">3</a></li>
                    <li className="page-item"><a className="page-link">Next</a></li> */}
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        Previous
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            {/* RIGHT SIDEBAR */}
            

              {/* Sidebar Slider */}
              {/* <div className="sidebar-widget widget-slider">
                <div className="sidebar-slider normal-slider">
                  {[10,9,8].map(num => (
                    <div key={num} className="product-item">
                      <div className="product-title">
                        <a href="#">Product Name</a>
                        <div className="ratting">
                          {[1,2,3,4,5].map(i=>(
                            <i key={i} className="fa fa-star"></i>
                          ))}
                        </div>
                      </div>

                      <div className="product-image">
                        <a href="product-detail.html">
                          <img src={`images/product-${num}.jpg`} alt="Product" />
                        </a>
                        <div className="product-action">
                          <a href="#"><i className="fa fa-cart-plus"></i></a>
                          <a href="#"><i className="fa fa-heart"></i></a>
                          <a href="#"><i className="fa fa-search"></i></a>
                        </div>
                      </div>

                      <div className="product-price">
                        <h3><span>$</span>99</h3>
                        <a className="btn" href="">
                          <i className="fa fa-shopping-cart"></i> Buy Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Brands */}
              {/* <div className="sidebar-widget brands">
                <h2 className="title">Our Brands</h2>
                <ul>
                  {[
                    ["Nulla",45],
                    ["Curabitur",34],
                    ["Nunc",67],
                    ["Ullamcorper",74],
                    ["Fusce",89],
                    ["Sagittis",28]
                  ].map(([name,count])=>(
                    <li key={name}>
                      <a href="#">{name} </a>
                      <span>({count})</span>
                    </li>
                  ))}
                </ul>
              </div> */}

              {/* Tags */}
              {/* <div className="sidebar-widget tag">
                <h2 className="title">Tags Cloud</h2>
                {[
                  "Lorem ipsum","Vivamus","Phasellus","pulvinar","Curabitur","Fusce",
                  "Sem quis","Mollis metus","Sit amet","Vel posuere","orci luctus","Nam lorem"
                ].map(tag=>(
                  <a key={tag} href="#">{tag}</a>
                ))}
              </div> */}
            {/* </div> */}

          </div>
        </div>
      </div>
      {/* Brand Start */}
        {/* <div className="brand">
          <div className="container-fluid">
            <div className="brand-slider">
              {[1,2,3,4,5,6].map(num=>(
                <div key={num} className="brand-item">
                  <img src={`images/brand-${num}.png`} alt="Brand" />
                </div>
              ))}
            </div>
          </div>
        </div> */}
        {/* <Slider {...brandSettings} className="brand-slider">
          {[1,2,3,4,5,6].map(num => (
            <div key={num} className="brand-item">
              <img
                src={`images/brand-${num}.png`}
                alt="Brand"
                className="img-fluid"
              />
            </div>
          ))}
        </Slider> */}

        {/* Brand End */}

        {/* Footer Start */}
        <div className="footer">
          <div className="container-fluid">
            <div className="row">

              <div className="col-lg-3 col-md-6">
                <div className="footer-widget">
                  <h2>Get in Touch</h2>
                  <div className="contact-info">
                    <p><i className="fa fa-map-marker"></i> 123 E Store, Los Angeles, USA</p>
                    <p><i className="fa fa-envelope"></i> email@example.com</p>
                    <p><i className="fa fa-phone"></i> +123-456-7890</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="col-lg-3 col-md-6">
                <div className="footer-widget">
                  <h2>Follow Us</h2>
                  <div className="contact-info">
                    <div className="social">
                      <a href=""><i className="fab fa-twitter"></i></a>
                      <a href=""><i className="fab fa-facebook-f"></i></a>
                      <a href=""><i className="fab fa-linkedin-in"></i></a>
                      <a href=""><i className="fab fa-instagram"></i></a>
                      <a href=""><i className="fab fa-youtube"></i></a>
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
                  <img src="images/godaddy.svg" alt="Security" />
                  <img src="images/norton.svg" alt="Security" />
                  <img src="images/ssl.svg" alt="Security" />
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* Footer End */}

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
  )};
  export default Products;
