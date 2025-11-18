import { useEffect, useMemo, useState } from "react";
import {
  listPricingPolicies,
  createPricingPolicy,
  updatePricingPolicy,
  activatePricingPolicy,
  getActivePricingPolicy,
} from "../services/pricingService";
import { PricingPolicy } from "../types/schema";
import PricingPolicyForm from "../components/PricingPolicyForm";
import {
  ParkingMeter,
  Plus,
  Search,
  Edit,
  Power,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Euro,
  Settings,
} from "lucide-react";

// If you have a real auth hook, use it. Otherwise adapt this.
function useAuth() {
  // Example: { role: 'ADMIN' | 'MANAGER' | 'DRIVER' }
  return { role: "ADMIN" as "ADMIN" | "MANAGER" | "DRIVER" };
}
const canManagePricing = (role: ReturnType<typeof useAuth>["role"]) =>
  role === "ADMIN";

export default function PricingPoliciesPage() {
  const { role } = useAuth();
  const canManage = canManagePricing(role);

  const [items, setItems] = useState<PricingPolicy[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const list = await listPricingPolicies({
        offset,
        limit,
        search,
        orderBy: "createdAt",
        orderDir: "desc",
      });
      setItems(list.items);
      setTotal(list.total);
      const curr = await getActivePricingPolicy();
      setActiveId(curr?.id ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [offset, limit, search]);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  function openEdit(id: string) {
    setEditId(id);
  }
  function closeModals() {
    setShowCreate(false);
    setEditId(null);
  }

  async function handleCreate(vals: {
    name: string;
    baseFare: string;
    perKm: string;
  }) {
    await createPricingPolicy(vals);
    closeModals();
    await refresh();
  }

  async function handleUpdate(
    id: string,
    vals: { name: string; baseFare: string; perKm: string }
  ) {
    await updatePricingPolicy(id, vals);
    closeModals();
    await refresh();
  }

  async function handleActivate(id: string) {
    await activatePricingPolicy(id);
    await refresh();
  }

  const editing = items.find((i) => i.id === editId) || null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center">
              <ParkingMeter className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Pricing Policies
              </h1>
              <p className="text-slate-600 text-lg">Rate management</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Configure base fares and per-kilometer rates for your taxi service.
            Manage multiple pricing strategies and activate the one that fits
            your business needs.
          </p>
        </div>

        {canManage && (
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/50 active:scale-[.98]"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="h-4 w-4" />
            New Policy
          </button>
        )}
      </div>

      {/* Search & Status Section */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Settings className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Policy Management
            </h3>
            <p className="text-sm text-slate-500">
              Search and monitor active pricing policies
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              value={search}
              onChange={(e) => {
                setOffset(0);
                setSearch(e.target.value);
              }}
              placeholder="Search policy name..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pl-11 text-slate-900 placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">Status:</div>
            {activeId ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                <CheckCircle className="h-4 w-4" />1 Active Policy
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700">
                <XCircle className="h-4 w-4" />
                No Active Policy
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Policies Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Euro className="h-5 w-5 text-slate-600" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Pricing Policies
                </h3>
                <p className="text-sm text-slate-500">
                  Total: {total} policies
                </p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                Loading...
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Policy Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Base Fare
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Per Kilometer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={6}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-500">
                        Loading policies...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={6}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <ParkingMeter className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-900">
                          No pricing policies found
                        </p>
                        <p className="text-sm text-slate-500">
                          Create your first pricing policy to get started
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                          {p.name[0]?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {p.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            Policy ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-slate-400" />
                        <span className="font-mono text-lg font-semibold text-slate-900">
                          {Number(p.baseFare).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-slate-400" />
                        <span className="font-mono text-lg font-semibold text-slate-900">
                          {Number(p.perKm).toFixed(4)}
                        </span>
                        <span className="text-sm text-slate-500">/km</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.isActive ? (
                        <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          Active
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                          <XCircle className="h-4 w-4" />
                          Inactive
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 font-medium">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(p.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {canManage && (
                          <>
                            <button
                              onClick={() => openEdit(p.id)}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                              title="Edit policy"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {!p.isActive && (
                              <button
                                onClick={() => handleActivate(p.id)}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors duration-200"
                                title="Activate policy"
                              >
                                <Power className="h-4 w-4" />
                                Activate
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold">{offset + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(offset + limit, total)}
            </span>{" "}
            of <span className="font-semibold">{total}</span> policies
          </div>

          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              onClick={() => setOffset((o) => Math.max(0, o - limit))}
              disabled={offset === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              <span className="px-3 py-2 text-sm font-medium text-slate-900">
                Page {page} of {pages}
              </span>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              onClick={() =>
                setOffset((o) => (o + limit >= total ? o : o + limit))
              }
              disabled={offset + limit >= total}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Create New Policy
                </h2>
                <p className="text-slate-600">
                  Define base fare and per-kilometer rates
                </p>
              </div>
            </div>
            <PricingPolicyForm
              onSubmit={handleCreate}
              onCancel={closeModals}
              submitLabel="Create Policy"
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center">
                <Edit className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Edit Policy
                </h2>
                <p className="text-slate-600">
                  Update "{editing.name}" pricing configuration
                </p>
              </div>
            </div>
            <PricingPolicyForm
              initial={{
                name: editing.name,
                baseFare: editing.baseFare,
                perKm: editing.perKm,
              }}
              onSubmit={(vals) => handleUpdate(editing.id, vals)}
              onCancel={closeModals}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      )}
    </div>
  );
}
