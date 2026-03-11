import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Added toast import

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/carts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- REMOVE FROM CART LOGIC ---
  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/carts/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchCart(); 
        toast.success("Item removed from cart"); // Replaced alert
      } else {
        toast.error("Failed to remove item"); // Replaced alert
      }
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const validProducts = cart?.products?.filter(item => item.product !== null) || [];

  const totalPrice = validProducts.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  // 🔥 UPDATED: Logic to send cart items to WhatsApp
  const placeOrder = () => {
    if (validProducts.length === 0) {
      toast.error("Your cart doesn't have any valid products to order.");
      return;
    }

    const phoneNumber = "918208297551"; 

    // 1. Format the list of items
    const itemsList = validProducts
      .map((item, index) => `${index + 1}. ${item.product.title} (Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`)
      .join("\n");

    // 2. Create the WhatsApp message
    const message = `✨ *NEW BULK ORDER REQUEST* ✨
---------------------------
*Items:*
${itemsList}

*Total Amount:* ₹${totalPrice}
---------------------------
Hi! I want to confirm my order for these pieces. Please share the payment details (UPI/Bank) and estimated delivery time.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    toast.success("Redirecting your cart to WhatsApp!");
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  if (!cart || validProducts.length === 0) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/dashboard")} style={styles.shopBtn}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", textAlign: "left" }}>
      <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "20px" }}>Shopping Cart</h2>

      {validProducts.map((item) => (
        <div key={item.product._id} style={styles.cartCard}>
          <img 
            src={item.product.image} 
            alt={item.product.title} 
            style={styles.cartProductImage} 
          />
          
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#2d3436" }}>{item.product.title}</h3>
            <p style={{ margin: 0, color: "#636e72" }}>Unit Price: ₹{item.product.price}</p>
            <p style={{ margin: 0, color: "#636e72" }}>Quantity: {item.quantity}</p>
            
            <button 
              onClick={() => handleRemove(item.product._id)} 
              style={styles.removeBtn}
            >
              Remove Item
            </button>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
              ₹{item.product.price * item.quantity}
            </p>
          </div>
        </div>
      ))}

      <div style={styles.summaryBox}>
        <h3 style={{ margin: "0 0 20px 0" }}>Order Summary</h3>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
        <button onClick={placeOrder} style={styles.placeOrderBtn}>
          Place Order
        </button>
      </div>
    </div>
  );
}

const styles = {
  cartCard: {
  display: "flex",
  flexDirection: window.innerWidth < 600 ? "column" : "row", // Stack image and text
  alignItems: window.innerWidth < 600 ? "flex-start" : "center",
  gap: "15px",
  padding: "20px",
  borderBottom: "1px solid #eee"
},
cartProductImage: {
  width: window.innerWidth < 600 ? "100%" : "80px", // Full width image on mobile
  height: window.innerWidth < 600 ? "200px" : "80px",
  objectFit: "cover",
  borderRadius: "10px"
},
  
  removeBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#ff7675",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "0.3s"
  },
  summaryBox: {
    marginTop: "40px",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    borderRadius: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
  },
  placeOrderBtn: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#6c5ce7",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px"
  },
  shopBtn: {
    padding: "10px 20px",
    backgroundColor: "#6c5ce7",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px"
  }
};

export default Cart;