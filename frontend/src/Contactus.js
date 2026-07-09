
import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Contactus = () => {
   
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

    // Init scripts and load wishlist once
      useEffect(() => {
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

    const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );

      setMsg(res.data.message);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error) {
      setMsg("Server error. Try again.");
    }
  };
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
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item"><a href="#">Products</a></li>
                    <li className="breadcrumb-item active">Contact Us</li>


                </ul>
            </div>
        </div>
        {/* <!-- Breadcrumb End --> */}

        {/* <!-- Contact Start --> */}
        <div className="contact">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="contact-info">
                            <h2>Our Office</h2>
                            <h3><i className="fa fa-map-marker"></i>123 Office, Los Angeles, CA, USA</h3>
                            <h3><i className="fa fa-envelope"></i>office@example.com</h3>
                            <h3><i className="fa fa-phone"></i>+123-456-7890</h3>
                            <div className="social">
                                <a href=""><i className="fab fa-twitter"></i></a>
                                <a href=""><i className="fab fa-facebook-f"></i></a>
                                <a href=""><i className="fab fa-linkedin-in"></i></a>
                                <a href=""><i className="fab fa-instagram"></i></a>
                                <a href=""><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="contact-info">
                            <h2>Our Store</h2>
                            <h3><i className="fa fa-map-marker"></i>123 Store, Los Angeles, CA, USA</h3>
                            <h3><i className="fa fa-envelope"></i>store@example.com</h3>
                            <h3><i className="fa fa-phone"></i>+123-456-7890</h3>
                            <div className="social">
                                <a href=""><i className="fab fa-twitter"></i></a>
                                <a href=""><i className="fab fa-facebook-f"></i></a>
                                <a href=""><i className="fab fa-linkedin-in"></i></a>
                                <a href=""><i className="fab fa-instagram"></i></a>
                                <a href=""><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="contact-form">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Your Name"/>
                                    </div>
                                    <div className="col-md-6">
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Your Email" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-control" placeholder="Subject" />
                                </div>
                                <div className="form-group">
                                    <textarea name="message" value={formData.message} onChange={handleChange} className="form-control" rows="5" placeholder="Message"></textarea>
                                </div>
                                <div><button className="btn" type="submit">Send Message</button></div>
                                {msg && <p className="mt-3">{msg}</p>}
                            </form>
                        </div>
                    </div>
                    {/* <div className="col-lg-12">
                        <div className="contact-map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.733248043701!2d-118.24532098539802!3d34.05071312525937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c648fa1d4803%3A0xdec27bf11f9fd336!2s123%20S%20Los%20Angeles%20St%2C%20Los%20Angeles%2C%20CA%2090012%2C%20USA!5e0!3m2!1sen!2sbd!4v1585634930544!5m2!1sen!2sbd" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
        {/* <!-- Contact End --> */}
        

      
         {/* Footer start*/}
        <Footer/>

        
        {/* Back to Top */}
        {/* <a href="#" className="back-to-top"><i className="fa fa-chevron-up"></i></a> */}
        <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          ><i className="fa fa-chevron-up"></i></button>
        
    </div>
  )};
  export default Contactus;
