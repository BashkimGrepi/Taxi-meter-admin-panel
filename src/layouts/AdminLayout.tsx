import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Car, User, Plus, Search, Settings, Wallet, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getEntrepenouerProfile } from "../services/entrepenouerService";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [adminData, setAdminData] = useState<{ username: string; companyName: string }>({
    username: "",
    companyName: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getEntrepenouerProfile();
        setAdminData({
          username: profile.username,
          companyName: profile.companyName,
        });
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    fetchProfile();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Drivers", path: "/", icon: <Car size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Add Driver", path: "/add-driver", icon: <Plus size={20} /> },
    { name: "Viva Wallet", path: "/viva-wallet", icon: <Wallet size={20} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded">
                  <Car size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Taxi-Meter</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div
                    className={`mr-2 ${
                      isActive(item.path)
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}

            
            </div>

            {/* User Profile and Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 border-r pr-4">
                <div className="flex-shrink-0">
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 0v24H0V0h24z" fill="none" />
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{adminData.username}</div>
                  <div className="text-xs text-gray-500">{adminData.companyName}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-sm font-medium text-red-500 hover:text-red-700"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X size={24} aria-hidden="true" />
                ) : (
                  <Menu size={24} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="mr-3">{item.icon}</div>
                  {item.name}
                </Link>
              ))}
            </div>

            
            

            {/* Mobile profile & logout */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 0v24H0V0h24z" fill="none" />
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{adminData.username}</div>
                  <div className="text-sm font-medium text-gray-500">{adminData.companyName}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-red-500 rounded-md hover:bg-gray-50"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
