import { useDriversActivity } from "../../hooks/dashboard/useDashboardData";

export default function DriverActivityCard() {
    const { data, isLoading, isError } = useDriversActivity();


    if (isError) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <div className="text-red-600">Error loading driver activity</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
        );

    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Driver Activity</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Drivers</span>
                    <span className="text-sm font-medium">{data?.drivers.total}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Drivers</span>
                    <span className="text-sm font-medium">{data?.drivers.active}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Invited Drivers</span>
                    <span className="text-sm font-medium">{data?.drivers.invited}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inactive Drivers</span>
                    <span className="text-sm font-medium">{data?.drivers.inactive}</span>
                </div>
            </div>
        </div>


    )
}