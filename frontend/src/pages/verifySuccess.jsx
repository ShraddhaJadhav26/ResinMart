import React from "react";
import { useNavigate } from "react-router-dom";

function VerifySuccess() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h2 style={{ color: "#2d3436" }}>Email Verified!</h2>
        <p style={{ color: "#636e72", marginBottom: "20px" }}>
          Your account is now active. You can start shopping for beautiful resin art.
        </p>
        <button onClick={() => navigate("/login")} style={styles.button}>
          Login to ResinMart
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f4f6f9" },
  card: { padding: "40px", backgroundColor: "white", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "400px" },
  icon: { fontSize: "50px", marginBottom: "10px" },
  button: { padding: "12px 25px", backgroundColor: "#6c5ce7", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", width: "100%" }
};

export default VerifySuccess;