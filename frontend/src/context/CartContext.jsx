import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/carts/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Keep your existing state update logic
      setCart([...cart, product]); 
      console.log("Cart updated:", data);

    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  // --- ADDED THIS FEATURE ONLY ---
  const removeFromCart = (id) => {
    // This simply filters the local list so the item vanishes from UI
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};