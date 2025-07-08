import { getDriverReport } from "../services/driverReportService";
import { Driver } from "../types/Driver";
import { Report } from "../types/Report";
import SummaryCard from "./SummaryCard";
import { useState } from "react";
import EditDriverModal from "./EditDriverModal";
import { deleteDriver, updateDriver } from "../services/driversService";
import { Eye, Edit, Trash2, Phone } from "lucide-react";

interface Props {
  driver: Driver;
}

const DriverCard = ({ driver }: Props) => {
  const [showSummary, setShowSummary] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<Driver>(driver);

  const handleViewClick = async () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    try {
      const response = await getDriverReport(driver.driverId, today);
      setReport(response);
      setShowSummary(true);
    } catch (error) {
      console.error("Error fetching driver report:", error);
      setShowSummary(false);
    }
  };

  const handleUpdate = async (updatedDriver: Driver) => {
    try {
      await updateDriver(updatedDriver);
      alert("Driver updated successfully!");
      setShowSummary(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Failed to update driver. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this driver?");
    if (!confirmDelete) return;

    try {
      await deleteDriver(driver.driverId);
      alert("Driver deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("Failed to delete driver. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Driver Info */}
      <div className="p-5 flex items-center">
        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
          {driver.firstname.charAt(0).toUpperCase()}
          {driver.lastname.charAt(0).toUpperCase()}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {driver.firstname} {driver.lastname}
          </h3>
          <p className="text-sm text-gray-500">{driver.email}</p>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <Phone size={14} className="mr-1" />
            {driver.phoneNumber}
          </div>
          {/* Kovakoodattu vehicle */}
          <p className="text-sm text-gray-400 mt-1">Toyota Prius 2020</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex items-center justify-between">
        <button
          onClick={handleViewClick}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
        >
          <Eye size={16} className="mr-1" />
          {showSummary ? "Hide Details" : "View Details"}
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setFormData(driver);
              setShowEditModal(true);
            }}
            className="text-sm font-medium text-gray-600 hover:text-gray-500 flex items-center"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Driver Summary */}
      {showSummary && report && (
        <div className="p-5 border-t border-gray-200">
          <SummaryCard report={report} />
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditDriverModal
          driver={formData}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default DriverCard;
