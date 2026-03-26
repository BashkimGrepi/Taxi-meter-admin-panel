import { useState } from "react";
import { DriverProfile, DriverStatus } from "../types/schema";
import { useDriversLogic } from "../hooks/useDriversLogic";
import EditDriverModal from "../components/EditDriverModal";
import DriverRowStatus from "../components/DriverRowStatus";
import {
  Pencil,
  Users,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import AddDriverModal from "../components/AddDriverModal";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";

export default function Drivers() {
  const {
    q,
    status,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
  } = useDriversLogic();

  const [selected, setSelected] = useState<DriverProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const colDefs: ColDef<DriverProfile>[] = [
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Phone" },
    { field: "status", headerName: "Status" },
  ];

  function openEdit(d: DriverProfile) {
    setSelected(d);
    setModalOpen(true);
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Failed to load drivers
          </h3>
          <p className="text-slate-600 mb-4">
            {error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Manage your driver team, view their profiles, and track their
            status. Keep your fleet organized and efficient.
          </p>
        </div>
      </div>


      {/* Drivers Table */}
      <div className="ag-theme-quartz h-[520px] w-full rounded-2xl overflow-hidden border border-slate-200 bg-white">
        <AgGridReact 
          rowData={data?.items ?? []}
          columnDefs={colDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 140
          }}
          animateRows
        />
      </div>

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold">{(page - 1) * pageSize + 1}</span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(page * pageSize, data?.total ?? 0)}
              </span>{" "}
              of <span className="font-semibold">{data?.total ?? 0}</span>{" "}
              drivers
            </div>

            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                <span className="px-3 py-2 text-sm font-medium text-slate-900">
                  Page {page} of {totalPages}
                </span>
              </div>

              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || isLoading || !data}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <EditDriverModal
        open={modalOpen}
        driver={selected}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)} // React Query handles cache invalidation
      />
      <AddDriverModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdded={() => setAddModalOpen(false)} // React Query handles cache invalidation
        driver={null}
      />
    </div>
  );
}
