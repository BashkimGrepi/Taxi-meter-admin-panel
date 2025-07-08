import React from "react";
import { Report } from "../types/Report";

interface Props {
  report: Report | null;
}

const ReportCard: React.FC<Props> = ({ report }) => {
  if (!report) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">No report data available for today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Report</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <dt className="text-sm font-medium text-blue-600">Rides Today</dt>
          <dd className="mt-1 text-2xl font-semibold text-blue-900">{report.ridesToday}</dd>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <dt className="text-sm font-medium text-green-600">Total Rides</dt>
          <dd className="mt-1 text-2xl font-semibold text-green-900">{report.totalRides}</dd>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <dt className="text-sm font-medium text-yellow-600">Total KM</dt>
          <dd className="mt-1 text-2xl font-semibold text-yellow-900">{report.totalDistance} km</dd>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <dt className="text-sm font-medium text-purple-600">Earnings</dt>
          <dd className="mt-1 text-2xl font-semibold text-purple-900">{report.totalEarnings} €</dd>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 col-span-2">
          <dt className="text-sm font-medium text-indigo-600">Total Duration</dt>
          <dd className="mt-1 text-2xl font-semibold text-indigo-900">{report.totalDurationMinutes} min</dd>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
