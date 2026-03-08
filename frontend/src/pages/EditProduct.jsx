import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  if (role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetch(`http://localhost:8080/products`)
      .then(res => res.json())
      .then(data => {
        const product = data.find(p => p._id === id);
        if (product) {
          setTitle(product.title);
          setDescription(product.description);
          setPrice(product.price);
        }
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title, description, price })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Product updated!");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Edit Product</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br /><br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditProduct;