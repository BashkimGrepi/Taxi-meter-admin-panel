import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Car } from "lucide-react";
import loggin from "../assets/images/loggin.jpeg"; // Adjust the path as necessary

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", form);
            const { token } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("entrepenouerId", response.data.entrepenouerId); // Store the entrepreneur ID if available
            console.log("Login successful, token:", token);

            // Decode the JWT token to get role information
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = payload.role; 
            console.log("User role:", role);


            if (role !== "ROLE_ADMIN") {
                setError("You are not authorized to access this page.");
                return;
            }
            navigate("/");

        } catch (err) {
            setError("Invalid username or password.");

        }
    }
    return (
        <div className="flex h-screen bg-white">
            {/* Left side - Login form */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 lg:px-24 z-10">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="bg-black p-2 rounded-full">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">Taxi-Meter Panel</h2>
                        </div>
                        <h1 className="mt-6 text-3xl font-bold text-black">Welcome back</h1>
                        <p className="mt-2 text-gray-500">Please sign in to your account</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-black hover:text-gray-700">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            Sign in
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="font-medium text-black hover:text-gray-700"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden md:block md:w-1/2 bg-gray-100 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
              

                  <img src={loggin} alt="taxi_application" />              
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-2xl font-bold text-white">Taxi-Meter Admin Dashboard</h3>
                  <p className="text-gray-200 mt-2">Manage your taxi business efficiently</p>
              </div>
          </div>
        </div>
    );
};

export default Login;
