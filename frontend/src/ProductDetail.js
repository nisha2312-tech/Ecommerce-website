import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { initHomeScripts } from "./main";
import "./style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const ProductDetail = () => {

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
        const [reviews, setReviews] = useState([]);
        const [rating, setRating] = useState(0);
        const [comment, setComment] = useState("");
    
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
          


    // const username = localStorage.getItem("username");
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const slider1 =useRef(null);
    const slider2 =useRef(null);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
  if (slider1.current && slider2.current) {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }
}, [product]);

   useEffect(() => {
  axios
    .get(`http://localhost:5000/api/products/${id}`)
    .then(res => {
      setProduct({
        
        ...res.data,
        images: Array.isArray(res.data.images) ? res.data.images : [],
      });
      console.log("IMAGES:", res.data.images);

    })
    .catch(err => {
      console.error(err);
      setError("Product not found or server error");
    });
}, [id]);

// fetching data
useEffect(() => {
  axios
    .get(`http://localhost:5000/api/reviews/${id}`)
    .then((res) => {
      setReviews(res.data);
    })
    .catch((err) => {
      console.error("Error fetching reviews:", err);
    });
}, [id]);
  // submit review function
    const submitReview = () => {
    if (!rating || !comment) {
        alert("Please select rating and write review");
        return;
    }
    const currentDate = new Date().toISOString();
  axios
    .post("http://localhost:5000/api/reviews", {
      productid: id,
      username: username,
      rating: rating,
      comment: comment,
      date:currentDate,
    })
    .then((res) => {
      alert("Review added!");

      const newReview = {
        username,
        rating,
        comment,
        date: currentDate, // current date
      };

      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment("");
    })
    .catch((err) => {
      console.error(err);
      alert("Error adding review");
    });
};
    
    if (error) return <h2>{error}</h2>;
    if (!product) return <h2>Loading...</h2>;

    const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    fade: false,
    adaptiveHeight: true,
    asNavFor: nav2,
    };

    const thumbSliderSettings = {
    slidesToShow: Math.min(4, product.images?.length || 1),
    slidesToScroll: 1,
    infinite: true,
    speed: 500,
    asNavFor: nav1,
    focusOnSelect: true,
    arrows: true,
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

    // add to cart button code

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
    alert("Added to Cart!");
  };
  // Searching
      const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
        // console.log(product.category_id, typeof product.category_id);

     
      return matchesSearch;
    });



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

        {/* Product Detail Start */}
        <div className="product-detail">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="product-detail-top">
                              <div className="row">

                                <div className="col-md-5">
                                    <div className="product-slider-single">
                                        {product.images.length > 0 ? (
                                        <Slider {...mainSliderSettings} ref={slider1}>
                                            {product.images.map((img, index) => (
                                            <div key={index}>
                                                <img
                                                src={`http://localhost:5000${img}`}
                                                alt={`Product ${index}`}
                                                className="img-fluid"
                                                />
                                            </div>
                                            ))}
                                        </Slider>
                                        ) : (
                                        <img
                                            src="/images/placeholder.png"
                                            alt="No product"
                                            className="img-fluid"
                                        />
                                        )}

                                        </div>

                                        {/* <div className="product-slider-single-nav mt-3">
                                        {product.images.length > 0 && (
                                        <Slider {...thumbSliderSettings} ref={slider2}>
                                            {product.images.map((img, index) => (
                                            <div key={index} className="slider-nav-img">
                                                <img
                                                src={`http://localhost:5000${img}`}
                                                alt={`Thumbnail ${index}`}
                                                className="img-fluid"
                                                />
                                            </div>
                                            ))}
                                        </Slider>
                                        )}

                                    </div>*/}

                                </div>
                                
                                <div className="col-md-7">
                                    <div className="product-content">
                                        <div className="title"><h2>{product.productname}</h2><p>{product.description}</p></div>
                                        <div className="ratting">
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                        </div>
                                        <div className="price">
                                            {/* <h4>Price:</h4> */}
                                            <p>${product.price}</p>
                                            
                                        </div>
                                        <p>Free Delivery</p>
                              
                                        <div className="action">
                                            <button
                                                className="btn btn-primary addcart-btn"
                                                onClick={() => addToCart(product)}
                                                >
                                                <i className="fa fa-shopping-cart"></i> Add to Cart
                                                </button>
                                                <Link to="/Checkout" className="btn"><i className="fa fa-shopping-bag"></i>Buy Now</Link>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                    <div className="col-lg-12">
                        <div className="row product-detail-bottom">
                            <div className="col-lg-12">
                                <ul className="nav nav-pills nav-justified">
                                    <li className="nav-item">
                                        <a className="nav-link active" data-bs-toggle="pill" href="#description">Description</a>
                                    </li>
                                    {/* <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="pill" href="#specification">Specification</a>
                                    </li> */}
                                    <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="pill" href="#reviews">Reviews ({reviews.length})</a>
                                    </li>
                                </ul>

                                <div className="tab-content">
                                    <div id="description" className="container tab-pane active">
                                        <h4>Product description</h4>
                                        <p>{product.description}</p>
                                    
                                    </div>
                                    
                                    <div id="reviews" className="container tab-pane fade">
                                       {reviews.length === 0 ? (
                                        <p>No reviews yet</p>
                                        ) : (
                                        reviews.map((rev, index) => (
                                            <div className="reviews-submitted" key={index}>
                                            <div className="reviewer">
                                                {rev.username} -  
                                                <span>
                                                    {rev.date
  ? new Date(rev.date).toLocaleDateString("en-GB", {day: "2-digit",month: "short",year: "numeric",})
                                                    : "Today"}
                                                </span>
                                                
                                            </div>

                                            <div className="ratting">
                                                {Array(5)
                                                .fill()
                                                .map((_, i) => (
                                                    <i
                                                    key={i}
                                                    className={`fa ${
                                                        i < rev.rating ? "fa-star" : "fa-star-o"
                                                    }`}
                                                    ></i>
                                                ))}
                                            </div>

                                            <p>{rev.comment}</p>
                                            </div>
                                        ))
                                        )}
                                        <div className="reviews-submit">
                                            <h4>Give your Review:</h4>

                                            <div className="ratting">
                                                {[1,2,3,4,5].map((star)=>(
                                                <i
                                                    key={star}
                                                    className={`fa ${star <= rating ? "fa-star" : "fa-star-o"}`}
                                                    style={{cursor:"pointer"}}
                                                    onClick={()=>setRating(star)}
                                                ></i>
                                                ))}
                                            </div>

                                            <div className="row form">
                                                <div className="col-sm-12">

                                                <textarea
                                                    placeholder="Review"
                                                    value={comment}
                                                    onChange={(e)=>setComment(e.target.value)}
                                                ></textarea>
                                                </div>

                                                <div className="col-sm-12">
                                                <button onClick={submitReview}>Submit</button>
                                                </div>
                                            </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="col-lg-12">
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
                </div> */}
            </div>
        </div>
        
        {/* Product Detail End */}
        
         {/* Footer start */}
          <Footer/>
        
        {/* Back to Top */}
        {/* <a href="#" className="back-to-top"><i className="fa fa-chevron-up"></i></a> */}
        <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          ><i className="fa fa-chevron-up"></i></button>

    </div>
  )};
  export default ProductDetail;
