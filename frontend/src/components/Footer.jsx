import React from "react";
import { Instagram, Mail, Phone } from "lucide-react"; // Import the icons

function Footer() {
  const styles = {
    footer: {
      backgroundColor: "#2d3436",
      color: "#dfe6e9",
      padding: "40px 20px 20px 20px",
      marginTop: "50px",
      textAlign: "center",
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      maxWidth: "1100px",
      margin: "0 auto",
      gap: "30px",
    },
    section: {
      flex: "1 1 100%", // Force full width on small screens
      maxWidth: "300px", 
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      color: "#6c5ce7",
      marginBottom: "15px",
      fontSize: "1.2rem",
    },
    iconLink: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#fab1a0",
      textDecoration: "none",
      fontWeight: "bold",
      marginBottom: "10px"
    },
    bottomBar: {
      borderTop: "1px solid #636e72",
      marginTop: "20px",
      paddingTop: "15px",
      fontSize: "0.8rem",
      color: "#b2bec3",
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Brand Section */}
        <div style={styles.section}>
          <h3 style={styles.title}>ResinMart</h3>
          <p>Handmade with love and high-quality epoxy resin.</p>
        </div>

        {/* Contact Section */}
        <div style={styles.section}>
          <h4 style={styles.title}>Contact Us</h4>
          {/* <a href="resinmart0131@gmail.com" style={styles.iconLink}>
            <Mail size={20} /> sister@gmail.com
          </a> */}
          <div style={styles.iconLink}>
            <Phone size={20} /> +91 8208297551
          </div>
        </div>

        {/* Social Media Section */}
        <div style={styles.section}>
          <h4 style={styles.title}>Follow My Art</h4>
          <a 
            href="https://www.instagram.com/sneha_resin_creation?utm_source=qr&igsh=MTc2b2U2MHg1dzJxcw%3D%3D" 
            target="_blank" 
            rel="noreferrer" 
            style={styles.iconLink}
          >
            <Instagram size={24} color="#E4405F" /> {/* Instagram brand color */}
            {/* <span>@ResinArt_By_Sister</span> */}
          </a>
        </div>
      </div>

      <div style={styles.bottomBar}>
        © 2026 ResinMart | Handcrafted by [Sneha Mundhe]| Tech by[Shraddha Jadhav]
      </div>
    </footer>
  );
}

export default Footer;