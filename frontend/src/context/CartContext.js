import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);
  

  // Load cart according to logged user
  const loadCart = () => {

    const username = localStorage.getItem("username");

    if (username) {
      const cartKey = `cart_${username}`;

      const savedCart =
        JSON.parse(localStorage.getItem(cartKey)) || [];

      setCart(savedCart);


    } else {
      setCart([]);
    }
  };


  // First load
  useEffect(() => {
    loadCart();
  }, []);



  // Save whenever cart changes
useEffect(()=>{

 const username = localStorage.getItem("username");

 if(username && cart.length > 0){

   localStorage.setItem(
     `cart_${username}`,
     JSON.stringify(cart)
   );

 }

},[cart]);



  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );

};