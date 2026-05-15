import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.css';

import HomePage from './HomePage';
import Login from './Login';
import Products from './Products';
import ProductDetail from './ProductDetail';
import Wishlist from './Wishlist';
import Cart from "./Cart";
import Checkout from "./Checkout";
import Aboutus from "./Aboutus";
import Privacypolicy from "./Privacypolicy";
import Terms from "./Terms";
import Paymentpolicy from "./Paymentpolicy";

import Myaccount from "./Myaccount";
import Contactus from "./Contactus";

import Shippingpolicy from "./Shippingpolicy";
import Returnpolicy from "./Returnpolicy";
import Forgotpassword from "./Forgotpassword";
import Resetpassword from "./Resetpassword";
// import Header from "./components/Header";



// import HomePage from "./components/HomePage";
function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Myaccount" element={<Myaccount />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/Contactus" element={<Contactus />} />

        <Route path="/Privacypolicy" element={<Privacypolicy/>}/>
        <Route path="/Terms" element={<Terms/>}/>
        <Route path="/Paymentpolicy" element={<Paymentpolicy/>}/>
        <Route path="/Shippingpolicy" element={<Shippingpolicy/>}/>
        <Route path="/Returnpolicy" element={<Returnpolicy/>}/>
        <Route path="/Forgotpassword" element={<Forgotpassword/>}/>
        <Route path="/Resetpassword/:token" element={<Resetpassword/>}/>
        {/* <Route path="/Header" element={<Header/>}/> */}
        


      </Routes>
    </Router>
  );    
}
export default App;
