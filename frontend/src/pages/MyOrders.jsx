import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div style={styles.loader}>Loading your beautiful orders...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
          ← Back to Shop
        </button>
        <h2 style={styles.title}>Your Order History</h2>
        <p style={styles.subtitle}>Track your ResinMart art pieces here</p>
      </header>

      {orders.length === 0 ? (
        <div style={styles.emptyCard}>
          <p>No orders yet. Let's start your collection!</p>
          <button onClick={() => navigate("/dashboard")} style={styles.shopBtn}>Shop Now</button>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <span style={styles.label}>Order ID</span>
                  <p style={styles.idText}>#{order._id.slice(-6).toUpperCase()}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={styles.label}>Date</span>
                  <p style={styles.dateText}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Status Section: Payment & Tracking */}
              <div style={styles.statusSection}>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: order.paymentStatus === "Paid" ? "#d4edda" : "#fff3cd",
                  color: order.paymentStatus === "Paid" ? "#155724" : "#856404",
                  marginRight: "10px"
                }}>
                  ● Payment: {order.paymentStatus}
                </span>
                
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: "#e1f5fe",
                  color: "#0288d1"
                }}>
                  🚚 {order.orderStatus || "Processing"}
                </span>
              </div>

              <div style={styles.itemsList}>
                {order.items?.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    <span>{item.product?.title || item.title} <small>x{item.quantity}</small></span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <div>
                  <span style={styles.totalLabel}>Total: </span>
                  <span style={styles.totalPrice}>₹{order.totalAmount}</span>
                </div>
                {/* No Review Button here - Clean and safe! */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "40px 20px", maxWidth: "700px", margin: "0 auto", minHeight: "100vh", backgroundColor: "#fdfdfd" },
  header: { marginBottom: "30px" },
  backBtn: { background: "none", border: "none", color: "#3498db", cursor: "pointer", fontWeight: "600", padding: 0 },
  title: { fontSize: "28px", color: "#2d3436", margin: "10px 0 0" },
  subtitle: { color: "#636e72", fontSize: "14px" },
  list: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { backgroundColor: "#fff", borderRadius: "15px", padding: "20px", border: "1px solid #eee", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  label: { fontSize: "10px", textTransform: "uppercase", color: "#b2bec3", letterSpacing: "1px", fontWeight: "700" },
  idText: { margin: 0, fontWeight: "600", color: "#2d3436" },
  dateText: { margin: 0, fontSize: "14px", color: "#2d3436" },
  statusSection: { marginBottom: "15px", display: "flex", flexWrap: "wrap", gap: "10px" },
  statusBadge: { padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  itemsList: { padding: "10px 0", borderTop: "1px solid #f9f9f9", borderBottom: "1px solid #f9f9f9", marginBottom: "15px" },
  itemRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#2d3436", marginBottom: "5px" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontWeight: "600", color: "#636e72" },
  totalPrice: { fontSize: "20px", fontWeight: "800", color: "#27ae60" },
  emptyCard: { textAlign: "center", padding: "50px", border: "1px dashed #ccc", borderRadius: "15px" },
  shopBtn: { marginTop: "15px", padding: "10px 20px", backgroundColor: "#27ae60", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  loader: { textAlign: "center", paddingTop: "100px", color: "#636e72" }
};

export default MyOrders;