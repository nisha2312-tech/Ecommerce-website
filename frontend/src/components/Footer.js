import React from "react";
import { Link } from "react-router-dom";

function Footer() {
     
  return(
    <div>
      {/* Footer */}
      <div className="footer">
        <div className="container-fluid">
          <div className="row">
            {/* Contact */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h2>Get in Touch</h2>
                <div className="contact-info">
                  <p>
                    <i className="fa fa-map-marker"></i> 123 E Store, Los Angeles, USA
                  </p>
                  <p>
                    <i className="fa fa-envelope"></i> email@example.com
                  </p>
                  <p>
                    <i className="fa fa-phone"></i> +123-456-7890
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h2>Follow Us</h2>
                <div className="contact-info">
                  <div className="social">
                    {["twitter", "facebook-f", "linkedin-in", "instagram", "youtube"].map(
                      (platform, i) => (
                        <a href="#" key={i}>
                          <i className={`fab fa-${platform}`}></i>
                        </a>
                      )
                    )}
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
                <img src="images/godaddy.svg" alt="Payment Security" />
                <img src="images/norton.svg" alt="Payment Security" />
                <img src="images/ssl.svg" alt="Payment Security" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
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
    </div>
  );
}

export default Footer;