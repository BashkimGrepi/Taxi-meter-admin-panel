import React, { useState } from "react";
import axiosInstance from "../services/AxiosInstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AddDriver = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const generateTemporaryPassword = async () => {
    return Math.random().toString(36).slice(-8);
  }
  
  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post("/email/send-invitation", {
        email,
        temporaryPassword: await generateTemporaryPassword(),
        loginUrl: "http://localhost:8080/api/login" //Adjust the url to the correct endpoint
      }, {
        params: {
          entrepenouerId: 1 // Replace with actual entrepreneur ID
        }
      });

      setMessage(response.data);
    } catch (error) {
      console.error("Error sending invitation email:", error);
      setMessage("Failed to send invitation email. Please try again.");
    }
  }

   return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Add New Driver</h2>
      <input
        type="email"
        placeholder="Driver Email"
        className="border p-2 rounded w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Send Invitation
      </button>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};


export default AddDriver;