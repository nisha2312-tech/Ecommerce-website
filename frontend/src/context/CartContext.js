import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const username = localStorage.getItem("username");
  const cartKey = username ? `cart_${username}` : null;

  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (cartKey) {
      setCart(JSON.parse(localStorage.getItem(cartKey)) || []);
    }
  }, [cartKey]);

  useEffect(() => {
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, cartKey]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};