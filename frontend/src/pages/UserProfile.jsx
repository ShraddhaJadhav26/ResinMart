import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, MapPin, Shield, Edit, Save } from "lucide-react";
import toast from "react-hot-toast";
function UserProfile() {
  const { user, role, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(user?.address || "");

  // Keeps the local address state in sync with the user data
  useEffect(() => {
    if (user?.address) setAddress(user.address);
  }, [user]);

  const handleSaveAddress = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/update-address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: user.email, // Send email so Backend can find you in DB
          address: address   // The new address you typed
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData); // Update the "Hi, User" and Profile text immediately
        setIsEditing(false);
        alert("Address saved to Database!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  const styles = {
    container: {
      padding: "50px 20px",
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
      minHeight: "80vh",
    },
    card: {
      backgroundColor: "white",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "500px",
      textAlign: "center",
    },
    avatar: {
      width: "100px",
      height: "100px",
      backgroundColor: "#6c5ce7",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px",
      color: "white",
    },
    infoGroup: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "15px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
    },
    label: {
      fontSize: "0.9rem",
      color: "#636e72",
      margin: 0,
    },
    value: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#2d3436",
      margin: 0,
    },
    input: {
      width: "100%",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      marginTop: "5px",
      fontSize: "1rem"
    },
    editBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#6c5ce7",
      marginLeft: "auto"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>
          <User size={50} />
        </div>
        <h2 style={{ marginBottom: "30px", color: "#2d3436" }}>Your Profile</h2>

        <div style={styles.infoGroup}>
          <User size={20} color="#6c5ce7" />
          <div>
            <p style={styles.label}>Full Name</p>
            <p style={styles.value}>{user?.name || "Not Provided"}</p>
          </div>
        </div>

        <div style={styles.infoGroup}>
          <Mail size={20} color="#6c5ce7" />
          <div>
            <p style={styles.label}>Email Address</p>
            <p style={styles.value}>{user?.email || "Not Provided"}</p>
          </div>
        </div>

        {/* ADDRESS SECTION WITH EDIT LOGIC */}
        <div style={styles.infoGroup}>
          <MapPin size={20} color="#6c5ce7" />
          <div style={{ flex: 1 }}>
            <p style={styles.label}>Default Address</p>
            {isEditing ? (
              <input 
                style={styles.input}
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              />
            ) : (
              <p style={styles.value}>{user?.address || "No address saved"}</p>
            )}
          </div>
          <button 
            style={styles.editBtn} 
            onClick={() => isEditing ? handleSaveAddress() : setIsEditing(true)}
          >
            {isEditing ? <Save size={20} /> : <Edit size={20} />}
          </button>
        </div>

        <div style={{ ...styles.infoGroup, borderBottom: "none" }}>
          <Shield size={20} color="#6c5ce7" />
          <div>
            <p style={styles.label}>Account Role</p>
            <p style={{ ...styles.value, textTransform: "capitalize" }}>{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;