import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlist, setWishlist] = useState([]);


  // Load wishlist according to logged user
  const loadWishlist = () => {

    const username = localStorage.getItem("username");

    if (username) {

      const wishlistKey = `wishlist_${username}`;

      const savedWishlist =
        JSON.parse(localStorage.getItem(wishlistKey)) || [];

      setWishlist(savedWishlist);

    } else {

      setWishlist([]);

    }

  };


  // First load
  useEffect(() => {
    loadWishlist();
  }, []);



  // Save whenever wishlist changes
  useEffect(() => {

    const username = localStorage.getItem("username");

    if (username && wishlist.length > 0) {

      localStorage.setItem(
        `wishlist_${username}`,
        JSON.stringify(wishlist)
      );

    }

  }, [wishlist]);



  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        loadWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );

};