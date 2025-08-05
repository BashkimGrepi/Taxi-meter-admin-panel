import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Car, User, Mail, Lock, Building, Phone } from "lucide-react";
import loggin from "../assets/images/loggin.jpeg"; // Use the same image as login page

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    yTunnus: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        alert("Registration failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left side - Registration form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 lg:px-24 z-10 overflow-y-auto py-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-black p-2 rounded-full">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black">Taxi-Meter Panel</h2>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-black">Create Admin Account</h1>
            <p className="mt-2 text-gray-500">Register your company as an admin</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                      placeholder="Username"
                      value={form.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-gray-400 w-5 h-5" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-gray-400 w-5 h-5" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                      placeholder="Company Name"
                      value={form.companyName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="yTunnus" className="block text-sm font-medium text-gray-700 mb-1">
                    Y-tunnus (Finnish Business ID)
                  </label>
                  <input
                    id="yTunnus"
                    name="yTunnus"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                    placeholder="1234567-8"
                    value={form.yTunnus}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-black hover:text-gray-700"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 bg-gray-100 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
        <img
          src={loggin}
          alt="taxi_application"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-2xl font-bold text-white">Taxi-Meter Admin Dashboard</h3>
          <p className="text-gray-200 mt-2">Register your taxi company to get started</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
