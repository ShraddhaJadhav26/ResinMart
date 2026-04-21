import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const prodRes = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProduct(prodData);
      } else {
        setProduct(null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading product:", err);
      toast.error("Failed to load product details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/carts/add`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id })
      });
      if (response.ok) {
        toast.success("Added to cart! 🛒");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const handleOrderNow = async () => {
  // 1. Load Razorpay Script
  const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!isLoaded) {
    toast.error("Razorpay SDK failed to load.");
    return;
  }

  // 2. Razorpay Window Options
  const options = {
    key: "rzp_test_SfnBoABLFevE3K", // 👈 Use your actual Test Key
    amount: product.price * 100, 
    currency: "INR",
    name: "ResinMart",
    description: `Order for ${product.title}`,
    handler: async function (response) {
      toast.success("Payment Successful!");

      // 3. Save to Database & Redirect to WhatsApp
      const phoneNumber = "918208297551"; 
      const message = `✨ *PAID ORDER* ✨\n\n*Product:* ${product.title}\n*Price:* ₹${product.price}\n*Payment ID:* ${response.razorpay_payment_id}\n\nHi! I've completed the payment for this piece.`;

      try {
        const token = localStorage.getItem("token");
        await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            items: [{
              product: product._id,
              title: product.title,
              price: product.price,
              quantity: 1
            }],
            totalAmount: product.price,
            paymentId: response.razorpay_payment_id
          })
        });
      } catch (err) {
        console.error("DB Save failed:", err);
      }

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    },
    prefill: {
      name: "User",
      email: "user@example.com"
    },
    theme: {
      color: "#6c5ce7",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

  const handleWhatsAppCustomization = () => {
    const phoneNumber = "918208297551"; 
    const message = `Hi! I'm interested in customizing this piece: ${product.title}\nLink: ${window.location.href}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) return <div style={styles.loader}>Loading product details...</div>;
  if (!product) return (
    <div style={styles.loader}>
      <h2>Product not found</h2>
      <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>Return to Shop</button>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.mainGrid}>
        <div style={styles.imageBox}>
          <img src={product.image} alt={product.title} style={{ width: "100%", borderRadius: "8px" }} />
        </div>
        <div style={styles.infoBox}>
          <h1 style={styles.title}>{product.title}</h1>
          <p style={styles.description}>{product.description}</p>
          <h2 style={styles.price}>₹{product.price}</h2>
          <div style={styles.buttonGroup}>
            {!role ? (
              <div style={styles.loginPrompt}>
                <p>Please <span onClick={() => navigate("/login")} style={styles.link}>login</span> to place an order.</p>
              </div>
            ) : (
              <>
                <button onClick={handleOrderNow} style={styles.buyBtn}>Order Now</button>
                <button onClick={handleWhatsAppCustomization} style={styles.whatsappBtn}>Customize on WhatsApp 💬</button>
                <button onClick={handleAddToCart} style={styles.cartBtn}>Add to Cart</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "60px 20px", maxWidth: "1100px", margin: "0 auto" },
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "50px", alignItems: "center" },
  imageBox: { borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  infoBox: { textAlign: "left" },
  title: { fontSize: "36px", color: "#2d3436", marginBottom: "15px" },
  description: { fontSize: "18px", color: "#636e72", lineHeight: "1.6", marginBottom: "25px" },
  price: { fontSize: "32px", color: "#27ae60", marginBottom: "30px" },
  buttonGroup: { display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" },
  buyBtn: { padding: "15px", backgroundColor: "#6c5ce7", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  whatsappBtn: { padding: "15px", backgroundColor: "#25D366", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  cartBtn: { padding: "15px", backgroundColor: "white", color: "#6c5ce7", border: "2px solid #6c5ce7", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  loader: { textAlign: "center", padding: "100px", fontSize: "20px" },
  backBtn: { marginTop: "20px", padding: "10px 20px", backgroundColor: "#6c5ce7", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  loginPrompt: { padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", textAlign: "center", border: "1px dashed #6c5ce7" },
  link: { color: "#6c5ce7", cursor: "pointer", textDecoration: "underline" }
};

export default ProductDetails;