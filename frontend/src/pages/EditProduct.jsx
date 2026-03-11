import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); // Included for consistency

  if (role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const product = data.find(p => p._id === id);
        if (product) {
          setTitle(product.title);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.category || "Keychain");
        }
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title, description, price, category })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // 🔥 Replaced alert with error toast
        toast.error(data.message || "Failed to update product");
        return;
      }

      // 🔥 Replaced alert with success toast
      toast.success("Product updated successfully!");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      // 🔥 Replaced alert with error toast
      toast.error("Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Edit Product</h2>

        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Product Title</label>
            <input
              style={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Keychain">Keychain</option>
              <option value="Frame">Frame</option>
              <option value="Jewelry">Jewelry</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Price (₹)</label>
            <input
              style={styles.input}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={styles.btnGroup}>
            <button type="submit" style={styles.button}>Update Product</button>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard")} 
              style={{ ...styles.button, background: "#ecf0f1", color: "#2d3436" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "20px"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "450px"
  },
  heading: {
    marginBottom: "25px",
    color: "#2d3436",
    fontSize: "1.8rem",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    textAlign: "left"
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#636e72"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    fontSize: "1rem",
    outline: "none"
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #dfe6e9",
    height: "100px",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical"
  },
  btnGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  button: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#6c5ce7",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "0.3s"
  }
};

export default EditProduct;