import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/carts/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchCart(); 
        toast.success("Item removed from cart");
      }
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const validProducts = cart?.products?.filter(item => item.product !== null) || [];
  const totalPrice = validProducts.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);

  const placeOrder = async () => {
    if (validProducts.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const phoneNumber = "918208297551"; 
    const itemsList = validProducts
      .map((item, index) => `${index + 1}. ${item.product.title} (Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`)
      .join("\n");

    const message = `✨ *NEW BULK ORDER* ✨\n\n*Items:*\n${itemsList}\n\n*Total:* ₹${totalPrice}\n\nHi! I want to order these items!`;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: validProducts.map(item => ({
            product: item.product._id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity
          })),
          totalAmount: totalPrice,
          phone: "Guest/User",
          address: "Bulk Order - Check WhatsApp"
        })
      });
      if (response.ok) console.log("Cart order saved.");
    } catch (err) {
      console.error("DB Save failed:", err);
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    toast.success("Redirecting to WhatsApp!");
    window.open(whatsappUrl, "_blank");
  };

  if (!cart || validProducts.length === 0) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/dashboard")} style={styles.shopBtn}>Go Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", textAlign: "left" }}>
      <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "20px" }}>Shopping Cart</h2>
      {validProducts.map((item) => (
        <div key={item.product._id} style={styles.cartCard}>
          <img src={item.product.image} alt={item.product.title} style={styles.cartProductImage} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#2d3436" }}>{item.product.title}</h3>
            <p style={{ margin: 0, color: "#636e72" }}>Unit Price: ₹{item.product.price}</p>
            <p style={{ margin: 0, color: "#636e72" }}>Quantity: {item.quantity}</p>
            <button onClick={() => handleRemove(item.product._id)} style={styles.removeBtn}>Remove Item</button>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>₹{item.product.price * item.quantity}</p>
          </div>
        </div>
      ))}
      <div style={styles.summaryBox}>
        <h3 style={{ margin: "0 0 20px 0" }}>Order Summary</h3>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
        <button onClick={placeOrder} style={styles.placeOrderBtn}>Place Order</button>
      </div>
    </div>
  );
}

const styles = {
  cartCard: { display: "flex", gap: "15px", padding: "20px", borderBottom: "1px solid #eee", alignItems: "center" },
  cartProductImage: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" },
  removeBtn: { marginTop: "10px", padding: "8px 15px", backgroundColor: "#ff7675", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" },
  summaryBox: { marginTop: "40px", padding: "30px", backgroundColor: "#f9f9f9", borderRadius: "15px" },
  placeOrderBtn: { width: "100%", padding: "15px", backgroundColor: "#6c5ce7", color: "white", border: "none", borderRadius: "10px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" },
  shopBtn: { padding: "10px 20px", backgroundColor: "#6c5ce7", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "20px" }
};

export default Cart;