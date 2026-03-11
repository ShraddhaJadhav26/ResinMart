import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Admin from "./pages/Admin";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import AdminOrders from "./pages/AdminOrders";
import MyOrders from "./pages/MyOrders";
import VerifySuccess from "./pages/verifySuccess"; 
import Footer from "./components/Footer"; // Ensure this path matches your folder structure
import Navbar from "./components/Navbar";
import UserProfile from"./pages/UserProfile";
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <> {/* This is a Fragment that groups the Routes and Footer together */}

    <Navbar />
    <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin-orders" element={<AdminOrders />} /> 
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/verify-success" element={<VerifySuccess />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* The Footer will now appear at the bottom of every page */}
      <Footer /> 
    </>
  );
}

export default App;