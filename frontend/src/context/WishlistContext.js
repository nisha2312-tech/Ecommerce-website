import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const username = localStorage.getItem("username");
  const wishlistKey = username ? `wishlist_${username}` : null;

  const [wishlist, setWishlist] = useState([]);

  // Load wishlist
  useEffect(() => {
    if (wishlistKey) {
      const savedWishlist =
        JSON.parse(localStorage.getItem(wishlistKey)) || [];
      setWishlist(savedWishlist);
    } else {
      setWishlist([]);
    }
  }, [wishlistKey]);

  // Save wishlist
  useEffect(() => {
    if (wishlistKey) {
      localStorage.setItem(
        wishlistKey,
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist, wishlistKey]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, setWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};