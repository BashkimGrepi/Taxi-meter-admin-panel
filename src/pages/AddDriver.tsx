import React, { useState } from "react";
import axiosInstance from "../services/AxiosInstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AddDriver = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        password: "",
        
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        //axiosInstanse is already set up with the base URL and token interceptor ->
        //localhost:8080/api

        try {
            await axiosInstance.post("/admin/drivers/add", form);
            alert("Driver added successfully!");
            navigate("/"); // Redirect to the admin dashboard after successful addition
            
        } catch (error) {
            console.error("There was an error adding the driver!", error);
            alert("There was an error adding the driver!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
  {/* Header */}
  <div className="mb-6 text-center">
    <h2 className="text-3xl font-bold text-gray-900">Add New Driver</h2>
    <p className="mt-1 text-sm text-gray-500">Fill in the driver's information below</p>
  </div>

  {/* Form */}
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
        First Name
      </label>
      <input
        id="firstname"
        type="text"
        name="firstname"
        value={form.firstname}
        onChange={handleChange}
        placeholder="First name"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
        Last Name
      </label>
      <input
        id="lastname"
        type="text"
        name="lastname"
        value={form.lastname}
        onChange={handleChange}
        placeholder="Last name"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        id="email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
        Phone Number
      </label>
      <input
        id="phoneNumber"
        type="tel"
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        placeholder="Phone"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required
      />
    </div>

    {/* Submit Button */}
    <div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Driver
      </button>
    </div>
  </form>
</div>

    );
};


export default AddDriver;