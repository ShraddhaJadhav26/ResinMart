import React, { useEffect, useState, useContext } from "react"; // Added useContext
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext); // Access role to check if logged in

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

  // 🔥 UPDATED: Now redirects to WhatsApp instead of Razorpay
  const handleOrderNow = async () => {
    const phoneNumber = "918208297551"; 
    const message = `✨ *NEW ORDER REQUEST* ✨
  
*Product:* ${product.title}
*Price:* ₹${product.price}
*Link:* ${window.location.href}

Hi! I want to confirm my order for this piece. Please share the payment details (UPI/Bank) and estimated delivery time.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Show a quick success toast before redirecting
    toast.success("Redirecting to WhatsApp to complete your order!");
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
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
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-image" 
            style={{ width: "100%", borderRadius: "8px" }} 
          />
        </div>
        <div style={styles.infoBox}>
          <h1 style={styles.title}>{product.title}</h1>
          <p style={styles.description}>{product.description}</p>
          <h2 style={styles.price}>₹{product.price}</h2>
          
          <div style={styles.buttonGroup}>
            {/* 🔥 MODIFIED: Conditional Rendering for Guest vs Logged-in User */}
            {!role ? (
              <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", textAlign: "center", border: "1px dashed #6c5ce7" }}>
                <p style={{ margin: 0, fontWeight: "600", color: "#2d3436" }}>
                  Please <span onClick={() => navigate("/login")} style={{ color: "#6c5ce7", cursor: "pointer", textDecoration: "underline" }}>login</span> to place an order.
                </p>
              </div>
            ) : (
              <>
                <button onClick={handleOrderNow} style={styles.buyBtn}>Order Now</button>
                <button onClick={handleWhatsAppCustomization} style={styles.whatsappBtn}>
                  Customize on WhatsApp 💬
                </button>
                <button onClick={handleAddToCart} style={styles.cartBtn}>Add to Cart</button>
              </>
            )}
          </div>
          <p style={styles.guarantee}>✓ Handmade with love and high-quality epoxy resin</p>
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
  guarantee: { fontSize: "13px", color: "#b2bec3" },
  loader: { textAlign: "center", padding: "100px", fontSize: "20px" },
  backBtn: { marginTop: "20px", padding: "10px 20px", backgroundColor: "#6c5ce7", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }
};

export default ProductDetails;