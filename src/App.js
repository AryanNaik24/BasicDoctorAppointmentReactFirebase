import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Book from "./components/Book";
import StaffLogin from "./components/StaffLogin";
import StaffDashboard from "./components/StaffDashboard";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="/book" element={user ? <Book /> : <Navigate to="/" />} />
        <Route
          path="/staff-login"
          element={user ? <Navigate to="/staff-dashboard" /> : <StaffLogin />}
        />
        <Route
          path="/staff-dashboard"
          element={
            user && user.uid === "a8ApqFYxRfZKnM5pMmziarSjKU12" ? (
              <StaffDashboard />
            ) : (
              <Navigate to="/staff-login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
