import { Entrepenouer } from "../types/Entrepenouer";
import { getEntrepenouerProfile, updateEntrepenouerProfile } from "../services/entrepenouerService";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { User, Mail, Building, Save, CheckCircle, AlertCircle, RefreshCw, LinkIcon } from "lucide-react";
import axiosInstance from "../services/AxiosInstance";
import MaskedValue from "../components/MaskedValue";

const AdminProfile = () => {
  // State for profile data
  const [admin, setAdmin] = useState<Entrepenouer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Stripe connection
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeUserId, setStripeUserId] = useState<string | null>(null);
  const [isLoadingStripe, setIsLoadingStripe] = useState(true);

  // Form state
  const [profileFormData, setProfileFormData] = useState({
    username: "",
    email: "",
    companyName: "",
    yTunnus: ""
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const data = await getEntrepenouerProfile();
        setAdmin(data);
        
        setProfileFormData({
          username: data.username || "",
          email: data.email || "",
          companyName: data.companyName || "",
          yTunnus: data.yTunnus || ""
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile information");
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchStripeStatus = async () => {
      setIsLoadingStripe(true);
      try {
        const response = await axiosInstance.get("/admin/stripe/profile");
        setStripeConnected(response.data.stripeConnected === true);
        setStripeUserId(response.data.stripeUserId || null);
      } catch (error) {
        console.error("Error fetching stripe data:", error);
        try {
          // Fallback to /stripe/me endpoint
          const response = await axiosInstance.get("/stripe/me");
          setStripeConnected(response.data.stripeLinked === true);
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      } finally {
        setIsLoadingStripe(false);
      }
    };

    fetchProfileData();
    fetchStripeStatus();
  }, []);

  // Handle form field changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateEntrepenouerProfile(profileFormData);
      setAdmin(updated);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };
  
  // Refresh Stripe status
  const handleRefreshStripe = async () => {
    setIsLoadingStripe(true);
    try {
      const response = await axiosInstance.get("/admin/stripe/profile");
      setStripeConnected(response.data.stripeConnected === true);
      setStripeUserId(response.data.stripeUserId || null);
      toast.success("Stripe connection status refreshed");
    } catch (error) {
      console.error("Failed to refresh stripe status:", error);
      toast.error("Could not refresh Stripe connection status");
    } finally {
      setIsLoadingStripe(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your account information
        </p>
      </div>
      
      {/* Admin Information Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Company Information
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
        
        {/* Edit Mode */}
        {isEditing ? (
          <form onSubmit={handleProfileSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={profileFormData.username}
                    onChange={handleProfileChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profileFormData.email}
                    onChange={handleProfileChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-1">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={profileFormData.companyName}
                    onChange={handleProfileChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-1">
                <label htmlFor="yTunnus" className="block text-sm font-medium text-gray-700">
                  Y-tunnus (Finnish Business ID)
                </label>
                <input
                  type="text"
                  name="yTunnus"
                  id="yTunnus"
                  value={profileFormData.yTunnus}
                  onChange={handleProfileChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save size={16} className="mr-2" /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          // View Mode
          <div className="px-4 py-5 sm:p-6">
            {admin && (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <User size={16} className="mr-2 text-gray-400" />
                    {admin.username}
                  </dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    {admin.email}
                  </dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <Building size={16} className="mr-2 text-gray-400" />
                    {admin.companyName || "-"}
                  </dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Y-tunnus</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {admin.yTunnus || "-"}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        )}
      </div>
      
      {/* Payment Integration Status */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Payment Integration
            </h3>
            
            <div className="flex items-center space-x-2">
              <div className={`flex items-center px-3 py-1 rounded-full ${
                stripeConnected ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {isLoadingStripe ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-current rounded-full mr-1.5 border-t-transparent"></div>
                    Loading...
                  </span>
                ) : stripeConnected ? (
                  <span className="flex items-center">
                    <CheckCircle size={16} className="mr-1.5" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center">
                    <AlertCircle size={16} className="mr-1.5" />
                    Not Connected
                  </span>
                )}
              </div>
              
              <button
                onClick={handleRefreshStripe}
                disabled={isLoadingStripe}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Refresh Stripe status"
              >
                <RefreshCw size={16} className={isLoadingStripe ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {isLoadingStripe ? (
            <div className="text-center py-4">
              <div className="animate-spin inline-block h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Checking payment integration status...</p>
            </div>
          ) : (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Payment Provider</dt>
                <dd className="mt-1 text-sm text-gray-900">Stripe</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Connection Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {stripeConnected ? (
                    <span className="text-green-600 font-medium">Connected</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Not Connected</span>
                  )}
                </dd>
              </div>
              
              {stripeConnected && stripeUserId && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Stripe Account ID</dt>
                  <dd className="mt-1">
                    <MaskedValue
                      value={stripeUserId}
                      maskType="partial"
                      showStart={4}
                      showEnd={4}
                      copyLabel="Stripe Account ID"
                      className="text-gray-900"
                    />
                  </dd>
                </div>
              )}
              
              <div className="sm:col-span-2">
                <a 
                  href="/viva-wallet" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {stripeConnected ? (
                    <>
                      <LinkIcon size={16} className="mr-2" />
                      Manage Payment Integration
                    </>
                  ) : (
                    <>
                      <LinkIcon size={16} className="mr-2" />
                      Connect Payment Account
                    </>
                  )}
                </a>
              </div>
            </dl>
          )}
        </div>
      </div>
      
      {/* Account Security Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Account Security
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => toast.info("Password change functionality would be implemented here")}
            >
              Change Password
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => toast.info("Two-factor authentication would be implemented here")}
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
