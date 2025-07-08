import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../services/AxiosInstance';
import { CheckCircle, XCircle } from 'lucide-react';

const VivaCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {

    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (!code) {
      setStatus('error');
      setMessage('Authorization code is missing from the URL');
      return;
    }

    const sendCodeToBackend = async () => {
      
      try {
        await axiosInstance.post("/stripe/oauth", { code, state });
        setStatus('success');
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        console.error('Error sending code to backend:', error);
        setStatus('error');
        setMessage("Stripe account linking failed. Please try again.");
      }
    };

    sendCodeToBackend();
  }, [location, navigate]);


    

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">Connecting your Stripe account</h2>
            <p className="mt-2 text-sm text-gray-500">Please wait while we process your authorization...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto" />
            <h2 className="mt-6 text-xl font-semibold text-gray-900">Success!</h2>
            <p className="mt-2 text-sm text-gray-500">
              Your Stripe account has been successfully connected.
            </p>
            <p className="mt-6 text-xs text-gray-400">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto" />
            <h2 className="mt-6 text-xl font-semibold text-gray-900">Connection Failed</h2>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
            <button 
              onClick={() => navigate('/viva-wallet')}
              className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VivaCallback;