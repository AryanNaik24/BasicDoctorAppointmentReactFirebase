import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import "./Dashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleBookAppointment = () => {
    navigate("/book");
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, "appointments", id));
      setAppointments(
        appointments.filter((appointment) => appointment.id !== id)
      );
      alert("Appointment deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    if (!user) return; // Do nothing if user is not logged in

    const fetchAppointments = async () => {
      const appointmentsCollection = collection(db, "appointments");
      const q = query(appointmentsCollection, where("userId", "==", user.uid)); // Filter by userId
      const appointmentSnapshot = await getDocs(q);
      const appointmentList = appointmentSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((doc) => doc.date && doc.time && doc.description); // Filter out empty fields
      setAppointments(appointmentList);
    };

    fetchAppointments();
  }, [user]);

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <button className="logout" onClick={handleLogout}>Logout</button>
      <button
        onClick={handleBookAppointment}
        className="book-appointment-button"
      >
        Book Appointment
      </button>
      <div className="appointments">
        <h3>Your Appointments</h3>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.time}</p>
                <p>Description: {appointment.description}</p>
                <button
                  onClick={() => handleDeleteAppointment(appointment.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
