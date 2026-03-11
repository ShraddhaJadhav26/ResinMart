import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false); // Added to track success state
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // 🔥 Replaced alert with error toast
        toast.error(data.message || "Registration failed");
        return;
      }

      // setSuccess(true); // Switch to success view (Keep this as per your logic)
      setSuccess(true);

      // 🔥 Replaced alert with success toast
      toast.success(data.message || "Registration successful! Please verify your email.");

    } catch (error) {
      console.error(error);
      // 🔥 Replaced alert with error toast
      toast.error("Something went wrong. Please try again later.");
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
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f4f6f9"
    }}>
      <div style={{
        width: "350px",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Register
        </h2>

        {/* If registration is successful, show a message instead of the form */}
        {success ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "green", fontWeight: "bold" }}>
              Registration successful!
            </p>
            <p>Please check your email to verify your account.</p>
            <button 
              onClick={() => navigate("/login")} 
              style={{ ...buttonStyle, backgroundColor: "#6c5ce7", marginTop: "10px" }}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button onClick={handleRegister} style={buttonStyle}>
              Register
            </button>

            <p style={{ textAlign: "center", marginTop: "15px" }}>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ color: "blue", cursor: "pointer" }}
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;