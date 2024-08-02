import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Book.css";

const Book = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const isDateValid = (selectedDate) => {
    const today = new Date();
    const appointmentDate = new Date(selectedDate);

    // Check if the selected date is in the past
    return appointmentDate >= today;
  };

  const isTimeValid = (selectedTime) => {
    const [hours] = selectedTime.split(":").map(Number);

    // Check if the selected time is within business hours (9 AM to 5 PM)
    return hours >= 9 && hours < 17;
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You need to be logged in to book an appointment.");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    if (!isDateValid(date) || (date === today && !isTimeValid(time))) {
      alert(
        "Please select a future date and time within business hours (9 AM - 5 PM)."
      );
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        date,
        time,
        description,
        userId: user.uid,
        userEmail: user.email,
      });
      setDate("");
      setTime("");
      setDescription("");
      alert("Appointment booked successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="container">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleBookAppointment}>
        <div className="form-group">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default Book;
