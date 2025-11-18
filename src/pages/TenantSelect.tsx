import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import { useTenant } from "../app/TenantProvider";
import { useTenantData } from "../hooks/useTenantData";
import {
  Building,
  Users,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import logo from "../assets/images/logo_black.png";
import { getJwtPayload } from "../utils/jwt";
import { getStoredToken } from "../services/AxiosInstance";

export default function TenantSelect() {
  const { memberships } = useAuth();
  const { setTenantId } = useTenant();
  const navigate = useNavigate();

  const ms = useMemo(() => memberships ?? [], [memberships]);
  const {
    data: tenantData,
    isLoading,
    isError,
    error,
    refetch,
  } = useTenantData(ms);

  function choose(tenantId: string) {
    console.log("Selecting tenant: ", tenantId);

    const currentPayload = getJwtPayload(getStoredToken());
    console.log("Current JWT payload before tenant switch: ", currentPayload?.tenantId);

    setTenantId(tenantId);
    navigate("/", { replace: true });

    setTimeout(() => {
      const newPayload = getJwtPayload(getStoredToken());
      console.log("New JWT payload after tenant switch: ", newPayload?.tenantId);
    }, 100);
  }

  function goBack() {
    navigate("/login", { replace: true });
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="h-8 w-8 text-indigo-600 animate-pulse" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Loading Companies
            </h1>

            <p className="text-slate-600 mb-6">
              We're fetching your company information...
            </p>

            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Failed to Load Companies
            </h1>

            <p className="text-slate-600 mb-6 leading-relaxed">
              {error?.message ||
                "We couldn't load your company information. Please try again."}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700"
              >
                <Building className="h-4 w-4" />
                Try Again
              </button>

              <button
                onClick={goBack}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No companies found
  if (!tenantData || tenantData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="h-8 w-8 text-slate-400" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              No Companies Found
            </h1>

            <p className="text-slate-600 mb-6 leading-relaxed">
              No company memberships were found for your account. Please contact
              your administrator.
            </p>

            <button
              onClick={goBack}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main company selection UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">
          {/* LEFT: Company selection */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10 w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Building className="h-8 w-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                Choose Company
              </h1>

              <p className="text-slate-600 leading-relaxed">
                Select the company you want to access
              </p>
            </div>

            {/* Company List */}
            <div className="space-y-4 mb-8">
              {tenantData.map(({ membership, tenant }) => (
                <button
                  key={`${membership.tenantId}-${membership.role}`}
                  onClick={() => choose(membership.tenantId)}
                  className="w-full text-left p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {tenant?.name?.[0] || membership.tenantId[0]}
                      </div>

                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-900 text-lg">
                          {tenant?.name || membership.tenantId}
                        </div>

                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Users className="h-4 w-4" />
                            <span>Role: {membership.role}</span>
                          </div>

                          {tenant?.businessId && (
                            <div className="text-sm text-slate-500">
                              ID: {tenant.businessId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            {/* Back Button */}
            <button
              onClick={goBack}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>

          {/* RIGHT: Branding */}
          <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center text-center">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl transform rotate-2"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl transform -rotate-2"></div>

              {/* Logo */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <img
                  src={logo}
                  alt="Taxi Admin Dashboard"
                  className="w-full max-w-sm mx-auto"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="mt-12 max-w-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Multi-Company Access
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Manage multiple taxi companies from a single dashboard. Switch
                between companies seamlessly.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Centralized management across multiple companies</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Role-based access control for each company</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Seamless switching between company contexts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
