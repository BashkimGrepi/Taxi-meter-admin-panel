import { useEffect, useState } from "react";
import { getDrivers, deleteDriver } from "../services/driversService";
import { Driver } from "../types/Driver";
import { getDriverReport } from "../services/driverReportService";
import { Report } from "../types/Report";
import { useNavigate } from "react-router-dom";
import { 
  Search, Plus, SortAsc, SortDesc, Filter, Download, Trash2, Edit, Eye, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight 
} from "lucide-react";
import EditDriverModal from "../components/EditDriverModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Driver | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [driversPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstDriver, indexOfLastDriver);
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);

  useEffect(() => {
    const loadDrivers = async () => {
      setIsLoading(true);
      try {
        const data = await getDrivers();
        setDrivers(data);
        setFilteredDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDrivers();
  }, []);

  useEffect(() => {
    let result = drivers;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter((driver) =>
        `${driver.firstname} ${driver.lastname} ${driver.email} ${driver.phoneNumber}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortField) {
      result = [...result].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredDrivers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [drivers, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Driver) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewDetails = async (driver: Driver) => {
    setSelectedDriver(driver);
    
    try {
      const today = new Date().toISOString().split("T")[0];
      const report = await getDriverReport(driver.driverId, today);
      setCurrentReport(report);
      setShowReportModal(true);
    } catch (error) {
      console.error("Error fetching driver report:", error);
      alert("Could not load driver report data");
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowEditModal(true);
  };

  const handleDeleteDriver = async (driverId: number) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await deleteDriver(driverId);
        setDrivers(drivers.filter(driver => driver.driverId !== driverId));
        alert("Driver deleted successfully");
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert("Failed to delete driver");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone Number"];
    const data = filteredDrivers.map(driver => [
      driver.driverId,
      driver.firstname,
      driver.lastname,
      driver.email,
      driver.phoneNumber
    ]);
    
    const csvContent = [
      headers.join(","),
      ...data.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "drivers.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-sm text-gray-500">Manage your driver workforce efficiently</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/add-driver')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            Add Driver
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search drivers by name, email or phone..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredDrivers.length} {filteredDrivers.length === 1 ? 'driver' : 'drivers'}
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 font-medium">No drivers found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('firstname')}
                    >
                      <div className="flex items-center">
                        <span>Name</span>
                        {sortField === 'firstname' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        <span>Email</span>
                        {sortField === 'email' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('phoneNumber')}
                    >
                      <div className="flex items-center">
                        <span>Phone Number</span>
                        {sortField === 'phoneNumber' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDrivers.map((driver) => (
                    <tr key={driver.driverId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                            {driver.firstname.charAt(0).toUpperCase()}
                            {driver.lastname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{driver.firstname} {driver.lastname}</div>
                            <div className="text-xs text-gray-500">ID: {driver.driverId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{driver.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{driver.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleViewDetails(driver)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditDriver(driver)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit Driver"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver.driverId)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Driver"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstDriver + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastDriver, filteredDrivers.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredDrivers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                        currentPage === 1 
                          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          page === currentPage
                            ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                        currentPage === totalPages 
                          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Edit Modal */}
      {showEditModal && selectedDriver && (
        <EditDriverModal
          driver={selectedDriver}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedDriver) => {
            setDrivers(
              drivers.map((d) =>
                d.driverId === updatedDriver.driverId ? updatedDriver : d
              )
            );
            setShowEditModal(false);
          }}
        />
      )}
      
      {/* Report Modal */}
      {showReportModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Driver Report</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mr-3">
                  {selectedDriver.firstname.charAt(0).toUpperCase()}
                  {selectedDriver.lastname.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedDriver.firstname} {selectedDriver.lastname}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedDriver.email}</p>
                  <p className="text-sm text-gray-500">{selectedDriver.phoneNumber}</p>
                </div>
              </div>
            </div>
            
            {currentReport ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-blue-600">Rides Today</dt>
                  <dd className="mt-1 text-2xl font-semibold text-blue-900">{currentReport.ridesToday}</dd>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-green-600">Total Rides</dt>
                  <dd className="mt-1 text-2xl font-semibold text-green-900">{currentReport.totalRides}</dd>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-yellow-600">Total Distance</dt>
                  <dd className="mt-1 text-2xl font-semibold text-yellow-900">{currentReport.totalDistance} km</dd>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-purple-600">Total Earnings</dt>
                  <dd className="mt-1 text-2xl font-semibold text-purple-900">{currentReport.totalEarnings} €</dd>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 md:col-span-2">
                  <dt className="text-sm font-medium text-indigo-600">Total Driving Duration</dt>
                  <dd className="mt-1 text-2xl font-semibold text-indigo-900">{currentReport.totalDurationMinutes} minutes</dd>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-gray-500">No report data available for this driver.</p>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
