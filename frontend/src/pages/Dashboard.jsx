import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
const { addToCart } = useContext(CartContext);
  console.log("ROLE:", role);
useEffect(() => {
  fetch("http://localhost:8080/products")
    .then(res => res.json())
    .then(data => {
      console.log("Products:", data);
      setProducts(data);
    })
    .catch(err => console.error(err));
}, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8080/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Product deleted!");

    // 🔥 Remove product from UI instantly
    setProducts(products.filter((product) => product._id !== id));

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};


const buttonStyle = {
  padding: "8px 15px",
  marginLeft: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  backgroundColor: "#333",
  color: "white"
};



  return (
    
    <div style={{ textAlign: "center", marginTop: "50px" }}>


  {toast && (
  <div
    style={{
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "green",
      color: "white",
      padding: "10px 20px",
      borderRadius: "6px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      zIndex: 1000
    }}
  >
    {toast}
  </div>
)}

      <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px"
}}>
  <div>
    <h2>Dashboard</h2>
    <p>Logged in as: <strong>{role}</strong></p>
  </div>

  <div>
    {role === "admin" && (
      <button onClick={() => navigate("/admin")} style={buttonStyle}>
        Admin Panel
      </button>
    )}

    <button onClick={handleLogout} style={buttonStyle}>
      Logout
    </button>

{role=="user" && (
  <button
    onClick={() => navigate("/cart")}
    style={{ ...buttonStyle, backgroundColor: "green" }}
  >
    Cart
  </button>
)}

  </div>
</div>

<hr />

<h3>Products</h3>

{products.length === 0 ? (
  <p>No products available</p>
) : (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      marginTop: "20px"
    }}
  >
    {products.map((product) => (
      <div
        key={product._id}
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        {product.image && (
          <img
            src={`http://localhost:8080/uploads/${product.image}`}
            alt={product.title}
  style={{
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px"}}
          />
        )}

        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <h4>₹ {product.price}</h4>

{role === "user" && (
  <button
   onClick={() => {
  addToCart(product);
  setToast("Product added to cart!");
  setTimeout(() => setToast(""), 2000);
}}
    style={{ ...buttonStyle, backgroundColor: "green", marginTop: "10px" }}
  >
    Add to Cart
  </button>
)}


        {role === "admin" && (
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => navigate(`/edit/${product._id}`)}
              style={buttonStyle}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(product._id)}
              style={{ ...buttonStyle, backgroundColor: "red" }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
)}
 </div>
  );
}

export default Dashboard;