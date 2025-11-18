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
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center  justify-between ">
            <div className="flex items-center gap-10">
              <User className="h-5 w-5 text-slate-600" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Driver Directory
                </h3>
                <p className="text-sm text-slate-500">
                  Total: {data?.total ?? 0} drivers
                </p>
              </div>
              <div className="relative">
                <input
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pl-11 text-slate-900 placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  value={q}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Name, phone, email..."
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
              <div className="relative">
                <select
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value={DriverStatus.INVITED}>Invited</option>
                  <option value={DriverStatus.ACTIVE}>Active</option>
                  <option value={DriverStatus.INACTIVE}>Inactive</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/50 active:scale-[.98]"
            >
              <Plus className="h-4 w-4" />
              Add Driver
            </button>
            {(isLoading || isFetching) && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                {isLoading ? "Loading..." : "Updating..."}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Driver
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Account
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading && !data && (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={5}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-500">
                        Loading drivers...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {data && data.items.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={5}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <Users className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-900">
                          No drivers found
                        </p>
                        <p className="text-sm text-slate-500">
                          {q
                            ? `No drivers match "${q}"`
                            : "Start by adding your first driver to the system"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {data &&
                data.items.map((d) => (
                  <tr
                    key={d.id}
                    className={`hover:bg-slate-50/50 transition-colors duration-200 ${
                      isPlaceholderData ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                          {d.firstName?.[0]}
                          {d.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {d.firstName} {d.lastName}
                          </div>
                          <div className="text-sm text-slate-500">
                            Driver ID: {d.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-slate-900">
                          {d.phone ?? "—"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {d.email ?? "—"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <DriverRowStatus status={d.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            d.userId ? "bg-green-500" : "bg-slate-300"
                          }`}
                        ></div>
                        <span className="text-sm text-slate-600">
                          {d.userId ? "Linked" : "Not linked"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(d)}
                          className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                          title="Edit driver"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
