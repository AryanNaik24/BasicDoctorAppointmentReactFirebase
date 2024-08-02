import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./StaffLogin.css";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user is admin
      if (user.uid === "a8ApqFYxRfZKnM5pMmziarSjKU12") {
        // Replace 'admin' with the actual admin UID or use another method to verify admin status
        navigate("/staff-dashboard");
      } else {
        alert("You do not have admin privileges.");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      alert("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="container">
      <h2>Staff Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default StaffLogin;
