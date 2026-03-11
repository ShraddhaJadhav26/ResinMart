import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    // Only parse if it's a valid JSON string, not "undefined" or null
    return (savedUser && savedUser !== "undefined" && savedUser !== "null") 
      ? JSON.parse(savedUser) 
      : null;
  });

  const login = (userRole, userData) => {
    setRole(userRole);
    setUser(userData); 
    localStorage.setItem("role", userRole);
    localStorage.setItem("user", JSON.stringify(userData)); 
  };
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role"); // Added
  localStorage.removeItem("user"); // Added
  setRole(null); 
  setUser(null); 
};

  // const logout = () => {
  //   setRole(null);
  //   setUser(null);
  //   localStorage.clear(); // Clears role, user, and token safely
  // };

  return (
    <AuthContext.Provider value={{ role, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};