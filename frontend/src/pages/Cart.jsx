import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, clearCart, totalPrice } =
    useContext(CartContext);

  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            product: item._id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          })),
          phone: "9999999999",
          address: "Test Address",
          totalAmount: totalPrice
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Order placed successfully!");
      clearCart();
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (cart.length === 0) {
    return <h2 style={{ padding: "40px" }}>Cart is empty</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Your Cart</h2>

      {cart.map((item) => (
        <div key={item._id} style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "10px"
        }}>
          <h3>{item.title}</h3>
          <p>Price: ₹ {item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}

      <h3>Total: ₹ {totalPrice}</h3>

      <button onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Cart;