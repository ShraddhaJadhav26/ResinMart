import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

     if (!response.ok) {
        // 🔥 Replaced alert with error toast
        toast.error(data.message || "Invalid credentials");
        return;
      }

      // Save token for API calls
      localStorage.setItem("token", data.token);

      // Pass role AND the user object (name, email, address) to context
      login(data.role, data.user);

      // 🔥 Replaced alert with success toast
      toast.success("Login successful! Welcome back.");
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      // 🔥 Replaced alert with error toast
      toast.error("Something went wrong during login. Please try again.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div style={{
      minHeight: "100vh", // Use minHeight for mobile scrolling
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f4f6f9",
      padding: "20px" // Added padding for mobile
    }}>
      <div style={{
        width: "100%", // Full width
        maxWidth: "350px", // But stop at 350px
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;