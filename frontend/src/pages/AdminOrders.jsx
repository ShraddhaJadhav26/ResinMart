import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { role } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchOrders();
    }
  }, [role]);

  // Function to update tracking status (Processing, Shipped, etc.)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });

      if (response.ok) {
        fetchOrders();
      } else {
        alert("Failed to update tracking status");
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Function to update payment status
  const updatePayment = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchOrders();
      } else {
        alert("Failed to update payment");
      }
    } catch (err) {
      console.error("Payment update error:", err);
    }
  };

  if (role !== "admin") return <Navigate to="/dashboard" />;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Order Management</h2>
        <p style={styles.subtitle}>Review and manage your sister's ResinMart sales</p>
      </header>

      {orders.length === 0 ? (
        <div style={styles.empty}>No orders placed yet.</div>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={styles.orderId}>Order #{order._id.slice(-6)}</span>
                  <span style={styles.dateText}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <span style={{
                  ...styles.badge, 
                  backgroundColor: order.paymentStatus === "Paid" ? "#d4edda" : "#fff3cd",
                  color: order.paymentStatus === "Paid" ? "#155724" : "#856404"
                }}>
                  {order.paymentStatus}
                </span>
              </div>

              <div style={styles.section}>
                <p style={styles.label}>Customer Details</p>
                <p style={styles.text}><strong>Phone:</strong> {order.phone}</p>
                <p style={styles.text}><strong>Address:</strong> {order.address}</p>
              </div>

              <div style={styles.section}>
                <p style={styles.label}>Update Tracking</p>
                <select 
                  value={order.orderStatus} 
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  style={styles.select}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="On the way">On the way</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div style={styles.section}>
                <p style={styles.label}>Items</p>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    <span>{item.product?.title || item.title} <small>x{item.quantity}</small></span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={styles.footer}>
                <div>
                   <span style={styles.totalLabel}>Total: </span>
                   <span style={styles.totalValue}>₹{order.totalAmount}</span>
                </div>
                
                {order.paymentStatus !== "Paid" && (
                  <button 
                    onClick={() => updatePayment(order._id)}
                    style={styles.statusButton}
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh" },
  header: { marginBottom: "30px", textAlign: "left" },
  title: { margin: 0, color: "#2d3436", fontSize: "28px" },
  subtitle: { color: "#636e72", marginTop: "5px" },
  grid: { 
  display: "grid", 
  gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(auto-fill, minmax(350px, 1fr))", 
  gap: "20px" 
},
  card: { 
    backgroundColor: "#fff", 
    borderRadius: "12px", 
    padding: "20px", 
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  orderId: { fontWeight: "bold", color: "#0984e3", fontSize: "14px" },
  dateText: { fontSize: "12px", color: "#636e72", marginTop: "2px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  section: { marginBottom: "15px" },
  label: { fontSize: "12px", color: "#b2bec3", textTransform: "uppercase", fontWeight: "700", marginBottom: "5px" },
  text: { margin: "3px 0", color: "#2d3436", fontSize: "14px" },
  select: { 
    width: "100%", 
    padding: "8px", 
    borderRadius: "6px", 
    border: "1px solid #ddd", 
    backgroundColor: "#f9f9f9",
    cursor: "pointer"
  },
  itemRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#2d3436", marginBottom: "5px" },
  footer: { borderTop: "1px solid #eee", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontWeight: "bold", color: "#2d3436" },
  totalValue: { fontSize: "18px", fontWeight: "800", color: "#2ecc71" },
  statusButton: {
    backgroundColor: "#0984e3",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
  },
  empty: { textAlign: "center", padding: "50px", color: "#636e72", fontSize: "18px" }
};

export default AdminOrders;