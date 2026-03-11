import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast"; // 🔥 Added toast import

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const { role } = useContext(AuthContext); 
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success("Product deleted successfully!"); // 🔥 Replaced alert
        setProducts(products.filter((product) => product._id !== id));
      } else {
        toast.error("Failed to delete product."); // 🔥 Replaced alert
      }
    } catch (error) {
      toast.error("Something went wrong"); // 🔥 Replaced alert
    }
  };

  const buttonStyle = {
    padding: "8px 15px",
    margin: "5px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#333",
    color: "white"
  };

  // Filter Logic - Using exact strings from Admin Panel
  const categories = ["All", "Keychain", "Frame", "Jewelry", "other"];
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}> 
      {/* 🔥 Removed old custom toast div as react-hot-toast handles this now */}
      
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover the Magic of Resin</h1>
        <p style={styles.heroSubtitle}>Handcrafted art pieces made with love and precision.</p>
        <button 
          onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} 
          style={styles.exploreBtn}
        >
          Explore Collection
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px", flexWrap: "wrap", padding: "0 20px" }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 20px",
              borderRadius: "20px",
              border: "1.5px solid #6c5ce7",
              backgroundColor: selectedCategory === cat ? "#6c5ce7" : "white",
              color: selectedCategory === cat ? "white" : "#6c5ce7",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: "1.8rem", color: "#2d3436", marginBottom: "30px" }}>
        {selectedCategory === "All" ? "Featured Products" : `${selectedCategory}s`}
      </h3>
      <hr style={{ width: "80%", border: "0.5px solid #eee", marginBottom: "30px" }} />

      <div className="product-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: window.innerWidth < 480 ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "25px", 
        padding: "0 5%" 
      }}>
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
              cursor: "pointer",
              border: "1px solid #f1f1f1",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease",
              backgroundColor: "#fff"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div>
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.title} 
                  style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "10px" }} 
                />
              )}
              <h3 style={{ fontSize: "1.2rem", margin: "15px 0 5px", color: "#2d3436" }}>{product.title}</h3>
              <h4 style={{ margin: "0 0 15px", color: "#6c5ce7", fontWeight: "bold" }}>₹ {product.price}</h4>
            </div>

            <div>
              {/* MODIFIED: Added !role check to hide buttons for logged-out users */}
              {!role ? (
                <p style={{ fontSize: "0.85rem", color: "#636e72", fontStyle: "italic" }}>
                  Please login to order
                </p>
              ) : (
                <>
                  {role === "user" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        addToCart(product);
                        toast.success("Added to cart!");
                      }}
                      style={{ 
                        ...buttonStyle, 
                        backgroundColor: "#00b894", 
                        width: "100%", 
                        marginLeft: "0", 
                        fontWeight: "bold",
                        fontSize: "1rem" 
                      }}
                    >
                      Add to Cart
                    </button>
                  )}

                  {role === "admin" && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit/${product._id}`);
                        }}
                        style={{ ...buttonStyle, flex: 1, marginLeft: "0" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, product._id)}
                        style={{ ...buttonStyle, backgroundColor: "#d63031", flex: 1, marginLeft: "0" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  hero: {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
    color: "white",
    marginBottom: "40px",
    borderRadius: "0 0 50px 50px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
  },
  heroTitle: {
    fontSize: "3rem",
    margin: "0 0 10px 0",
    fontWeight: "800",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    opacity: "0.9",
    marginBottom: "25px"
  },
  exploreBtn: {
    padding: "12px 30px",
    backgroundColor: "white",
    color: "#6c5ce7",
    border: "none",
    borderRadius: "25px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "0.3s"
  }
};

export default Dashboard;