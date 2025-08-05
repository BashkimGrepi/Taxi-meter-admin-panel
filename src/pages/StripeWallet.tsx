import { useEffect, useState } from "react";
import { CheckCircle, LinkIcon, AlertCircle, ArrowRight, ExternalLink, RefreshCw, XCircle } from "lucide-react";
import axiosInstance from "../services/AxiosInstance";
import { useNavigate } from "react-router-dom";

export default function PaymentIntegration() {
  const [isLinked, setIsLinked] = useState(false);
  const [stripeUserId, setStripeUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "info" | null>(null);
  const navigate = useNavigate();
  
  const fetchPaymentProviderStatus = async () => {
    setIsFetchingStatus(true);
    try {
      // Use the correct endpoint: /admin/stripe/profile (not /admin/me)
      // Note: axiosInstance automatically prepends /api
      const response = await axiosInstance.get("/admin/stripe/profile");
      console.log("Profile response:", response.data);
      
      // Check if stripeConnected is true from the backend response
      setIsLinked(response.data.stripeConnected === true);
      console.log("Payment provider linked status:", response.data.stripeConnected);
      
      // Store the stripeUserId if it exists
      if (response.data.stripeUserId) {
        setStripeUserId(response.data.stripeUserId);
        console.log("Stripe User ID:", response.data.stripeUserId);
      } else {
        console.log("No Stripe User ID found in response");
      }
      
      // Clear any previous errors
      setMessageType(null);
      setMessage("");
    } catch (error) {
      console.error("Failed to fetch payment provider status", error);
      
      // Try fallback to /stripe/me endpoint
      try {
        const stripeResponse = await axiosInstance.get("/stripe/me");
        console.log("Stripe status response:", stripeResponse.data);
        
        // Note this endpoint uses stripeLinked instead of stripeConnected
        setIsLinked(stripeResponse.data.stripeLinked === true);
        setMessageType(null);
        setMessage("");
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        setMessageType("error");
        setMessage("Could not verify connection status. Please refresh the page.");
      }
    } finally {
      setIsInitialLoading(false);
      setIsFetchingStatus(false);
    }
  };
  
  useEffect(() => {
    fetchPaymentProviderStatus();
  }, []);

  const initiateOAuthFlow = async () => {
    setLoading(true);
    setMessage("");
    setMessageType(null);

    const entrepenouerId = localStorage.getItem("entrepenouerId");
    if (!entrepenouerId) {
      setLoading(false);
      setMessageType("error");
      setMessage("Entrepreneur ID is missing");
      return;
    }
    console.log("Initiating OAuth flow for Entrepenouer ID:", entrepenouerId);
    
    try {
      // Use the correct endpoint for authorization URL
      const res = await axiosInstance.get(`/stripe/authorize-url?entrepenouerId=${entrepenouerId}`);
      if (res.data?.authUrl) {
        // Redirect to the authorization URL
        window.location.href = res.data.authUrl;
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error) {
      console.error("Failed to initiate connection:", error);
      setMessageType("error");
      setMessage("Failed to connect with payment provider. Please try again.");
      setLoading(false);
    }
  };

  const disconnectPaymentProvider = async () => {
    setLoading(true);
    setMessage("");
    setMessageType(null);

    const entrepenouerId = localStorage.getItem("entrepenouerId");
    if (!entrepenouerId) {
      setLoading(false);
      setMessageType("error");
      setMessage("Entrepreneur ID is missing");
      return;
    }

    try {
      await axiosInstance.post(`/stripe/disconnect?entrepenouerId=${entrepenouerId}`);
      await fetchPaymentProviderStatus(); // Refresh status after disconnect

      console.log("Payment provider disconnected successfully");
      setIsLinked(false);
      setStripeUserId(null);
      setMessageType("info");
      setMessage("Payment provider disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect payment provider:", error);
      setMessageType("error");
      setMessage("Failed to disconnect payment provider. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const navigateToDashboard = () => {
    navigate("/");
  };

  const handleRefresh = () => {
    fetchPaymentProviderStatus();
  };

  if (isInitialLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Checking payment provider status...</p>
        </div>
      </div>
    );
  }

  // Fixed layout that doesn't conflict with navigation
  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment Integration</h1>
          <p className="text-gray-600 text-sm">
            Connect your payment provider to start accepting payments
          </p>
        </div>
        
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Payment provider status section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Payment Provider Status</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {isLinked 
                    ? "Your payment account is connected and ready to process transactions" 
                    : "Connect your payment account to enable payment processing"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center px-3 py-1 rounded-full ${
                  isLinked ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {isLinked ? (
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
                  onClick={handleRefresh}
                  disabled={isFetchingStatus} 
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  title="Refresh status"
                >
                  <RefreshCw size={16} className={isFetchingStatus ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          </div>

          {/* Main content section */}
          <div className="p-6">
            {!isLinked ? (
              <div className="max-w-lg mx-auto">
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Connect Your Payment Account</h3>
                  <p className="text-gray-600 text-sm">
                    To process payments, you need to connect your payment provider account. This is a secure process 
                    that will redirect you to the provider's website to authorize the connection.
                  </p>
                </div>
                
                {messageType && (
                  <div className={`p-4 mb-6 rounded-md ${
                    messageType === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                  }`}>
                    <p className="flex items-start">
                      {messageType === "error" ? (
                        <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{message}</span>
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col items-center">
                  <button
                    onClick={initiateOAuthFlow}
                    disabled={loading}
                    className="w-full sm:w-auto flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2" size={20} />
                        Connect Payment Account
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6">
                    <a
                      href="https://dashboard.stripe.com/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      Don't have an account?
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto py-6 flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Account Connected
                </h3>
                <div className="flex gap-4">
                    
               
                <button
                  onClick={disconnectPaymentProvider}
                  disabled={loading}
                  className="inline-flex items-center px-5 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2" size={16} />
                      Disconnect Stripe
                    </>
                  )}
                </button>
              </div>

                <p className="text-gray-600 mb-6">
                  Your payment account has been successfully connected and you can now process payments.
                </p>
                
                <button
                  onClick={navigateToDashboard}
                  className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            )}
          </div>
          
          {/* Footer section */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-gray-500 text-sm">
                Need help? Check our 
                <a 
                  href="https://stripe.com/docs/connect" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  payment integration documentation
                </a>
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Powered by</span>
                <img 
                  src="https://cdn.worldvectorlogo.com/logos/stripe-4.svg" 
                  alt="Payment provider" 
                  className="h-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}