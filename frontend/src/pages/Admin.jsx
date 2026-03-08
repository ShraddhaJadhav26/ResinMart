import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

function Admin() {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
if(!role){
  return<p>Loading...</p>;
}
  if (role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
     const token = localStorage.getItem("token");

const response = await fetch("http://localhost:8080/products", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`
  },
  body: formData
});

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Product added successfully!");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // return (
    // <div style={{ textAlign: "center", marginTop: "50px" }}>
    //   <h2>Admin Panel</h2>

    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       placeholder="Product Title"
    //       value={title}
    //       onChange={(e) => setTitle(e.target.value)}
    //     />
    //     <br /><br />

    //     <textarea
    //       placeholder="Product Description"
    //       value={description}
    //       onChange={(e) => setDescription(e.target.value)}
    //     />
    //     <br /><br />

    //     <input
    //       type="number"
    //       placeholder="Price"
    //       value={price}
    //       onChange={(e) => setPrice(e.target.value)}
    //     />
    //     <br /><br />

    //     <input
    //       type="file"
    //       onChange={(e) => setImage(e.target.files[0])}
    //     />
    //     <br /><br />

    //     <button type="submit">Add Product</button>
    //   </form>
    // </div>
  // );
  return (
  <div style={styles.container}>
    <div style={styles.card}>
      <h2 style={styles.heading}>Admin Panel - Add Product</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <input
          style={styles.input}
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          style={styles.textarea}
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button style={styles.button} type="submit">
          Add Product
        </button>

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
    height: "100vh",
    background: "#f4f6f8"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "350px"
  },
  heading: {
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    height: "80px"
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: "#007bff",
    color: "white",
    cursor: "pointer"
  }
};
export default Admin;