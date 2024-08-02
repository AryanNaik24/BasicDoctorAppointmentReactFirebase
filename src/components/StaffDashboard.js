import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/staff-login");
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentsCollection = collection(db, "appointments");
      const appointmentSnapshot = await getDocs(appointmentsCollection);
      const appointmentList = appointmentSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (doc) => doc.date && doc.time && doc.description && doc.userEmail
        ); // Filter out empty fields
      setAppointments(appointmentList);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container">
      <h2>Staff Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <div className="appointments">
        <h3>All Appointments</h3>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.time}</p>
                <p>Description: {appointment.description}</p>
                <p>User Email: {appointment.userEmail}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments available.</p>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
