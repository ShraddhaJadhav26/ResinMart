import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, LogOut, Home, Package, User, PlusCircle, ClipboardList } from "lucide-react";

// ... (imports remain the same)
function Navbar() {
  const { role, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768; // Check for mobile width

  const styles = {
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "10px 3%" : "12px 5%",
      backgroundColor: "rgba(108, 92, 231, 0.95)",
      backdropFilter: "blur(10px)",
      color: "white",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
      flexWrap: "wrap", // Allow wrapping on small screens
    },
    logo: {
      fontSize: isMobile ? "1.2rem" : "1.6rem",
      fontWeight: "800",
      textDecoration: "none",
      color: "#fff",
      textTransform: "uppercase",
    },
    menuGroup: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "12px" : "25px",
    },
    navItem: {
      display: "flex",
      flexDirection: "column", // Stack icon and text on mobile
      alignItems: "center",
      gap: "2px",
      textDecoration: "none",
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "0.75rem", // Smaller text for mobile labels
      fontWeight: "500",
      cursor: "pointer",
    }
  };

  return (
    <nav style={styles.nav}>
      <Link to={role ? "/dashboard" : "/login"} style={styles.logo}>
        ResinMart
      </Link>

      <div style={styles.menuGroup}>
        {role ? (
          <>
            {/* On mobile, we only show the icon for Profile to save space */}
            <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
              <User size={isMobile ? 20 : 18} />
              {!isMobile && <span style={{ marginLeft: "5px" }}>Hi, {user?.name || "Admin"}</span>}
            </Link>

            <Link to="/dashboard" style={styles.navItem}>
              <Home size={20} /> <span>Home</span>
            </Link>

            {role === "admin" && (
              <>
                <Link to="/admin" style={styles.navItem}>
                  <PlusCircle size={20} /> <span>Add</span>
                </Link>
                <Link to="/admin-orders" style={styles.navItem}>
                  <ClipboardList size={20} /> <span>Orders</span>
                </Link>
              </>
            )}

            {role === "user" && (
              <>
                <Link to="/my-orders" style={styles.navItem}>
                  <Package size={20} /> <span>Orders</span>
                </Link>
                <Link to="/cart" style={styles.navItem}>
                  <ShoppingCart size={20} /> <span>Cart</span>
                </Link>
              </>
            )}

            <div onClick={() => logout()} style={{...styles.navItem, color: "#ff7675"}}>
              <LogOut size={20} /> <span>Logout</span>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{color: 'white', textDecoration: 'none'}}>Login</Link>
            <Link to="/register" style={{color: 'white', textDecoration: 'none'}}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
export default Navbar;