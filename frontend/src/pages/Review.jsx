import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Review() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        // Updated to match your backend route: /reviews/order/:id
        const response = await fetch(`http://localhost:8080/reviews/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!order) {
      alert("Order data is still loading...");
      return;
    }

    // 1. Get the items array (Backend uses 'items' based on your route)
    const items = order.items || [];
    const firstItem = items[0];

    // 2. THE FIX: Check every possible location for the ID
    // a) firstItem.product._id (If populated as an object)
    // b) firstItem.product (If it's just the ID string)
    // c) firstItem._id (Fallback)
    const pId = firstItem?.product?._id || firstItem?.product || firstItem?._id;

    // DEBUG: Check your console (F12) if it still fails!
    console.log("Full Order Object:", order);
    console.log("Extracted Product ID:", pId);

    if (!pId) {
      alert("Product ID is missing. Check the console (F12) to see the order structure.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderId,    // Matches your backend req.body
          productId: pId,      // Matches your backend req.body
          rating: rating,
          comment: comment
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Review submitted! Thank you for supporting ResinMart.");
        navigate(`/product/${pId}`);
      } else {
        alert("Backend Error: " + data.message);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error. Please check your connection.");
    }
  };
  if (!order) return <div style={styles.loader}>Loading order details...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Rate Your Resin Art</h2>
        <p style={styles.subtitle}>Order: #{orderId.slice(-6).toUpperCase()}</p>
        
        <div style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              style={{
                ...styles.starBtn,
                color: (hover || rating) >= star ? "#ffc107" : "#e4e5e9"
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            style={styles.textarea}
            placeholder="How do you like your custom resin piece?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit" style={styles.submitBtn} disabled={rating === 0}>
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "50px 20px", minHeight: "100vh", backgroundColor: "#fdfbfb" },
  card: { backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", maxWidth: "450px", width: "100%", textAlign: "center" },
  title: { color: "#2d3436", marginBottom: "10px" },
  subtitle: { color: "#636e72", marginBottom: "30px", fontSize: "14px" },
  starContainer: { marginBottom: "25px" },
  starBtn: { background: "none", border: "none", fontSize: "45px", cursor: "pointer", transition: "color 0.2s" },
  textarea: { width: "100%", height: "120px", padding: "15px", borderRadius: "10px", border: "1px solid #eee", marginBottom: "20px", outline: "none", fontFamily: "inherit", resize: "none" },
  submitBtn: { width: "100%", padding: "14px", backgroundColor: "#6c5ce7", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  loader: { textAlign: "center", padding: "100px", fontSize: "18px", color: "#636e72" }
};

export default Review;