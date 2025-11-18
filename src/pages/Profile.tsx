import { useEffect, useState } from "react";
import { getAdminProfile } from "../services/adminProfileService";
import { AdminProfileResponse } from "../types/schema";
import { notify } from "../app/ToastBoundary";
import {
  User,
  Mail,
  Shield,
  Building2,
  Calendar,
  BarChart3,
  Users,
  Send,
  Clock,
  Settings,
  Activity,
  Award,
} from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState<AdminProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data when component mounts
  async function fetchProfile() {
    setLoading(true);
    try {
      const profile = await getAdminProfile();
      setProfile(profile);
      console.log("Fetched profile business id:", profile?.businessId);
      setError(null);
    } catch (e: any) {
      notify.error(e?.message ?? "failed to load profile");
      setError(e?.message ?? "Failed to load profile");
      console.log("Error fetching profile:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchProfile();
  }, []); // leave dependency array empty to run only once on mount

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Admin Profile
              </h1>
              <p className="text-slate-600 text-lg">Account overview</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Manage your profile information, view account statistics, and track
            your administrative activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200">
            <Settings className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-900">
                Loading Profile
              </p>
              <p className="text-sm text-slate-500">
                Please wait while we fetch your information...
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-3xl bg-red-50 border border-red-200 shadow-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Error Loading Profile
              </h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {profile && (
        <div className="space-y-8">
          {/* Personal Information Card */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-slate-600" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Personal Information
                  </h3>
                  <p className="text-sm text-slate-500">
                    Your account details and basic information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Profile Header */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-2xl font-bold text-white">
                  {profile.email?.[0]?.toUpperCase() || "A"}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">
                    {profile.email}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                      <Shield className="h-4 w-4" />
                      {profile.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                        profile.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <Activity className="h-4 w-4" />
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Email Address
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {profile.username && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Username
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {profile.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {profile.accountCreatedAt && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Account Created
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {new Date(
                              profile.accountCreatedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Information Card */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-slate-600" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Company Information
                  </h3>
                  <p className="text-sm text-slate-500">
                    Organization and business details
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {profile.tenantName && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Company Name
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {profile.tenantName}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.businessId && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Business ID (Y-tunnus)
                          </p>
                          <p className="font-mono text-lg font-bold text-slate-900">
                            {profile.businessId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {profile.tenantId && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Tenant ID
                          </p>
                          <p className="font-mono text-lg font-bold text-slate-900">
                            {profile.tenantId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.joinedTenantAt && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Joined Company
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {new Date(
                              profile.joinedTenantAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-slate-600" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Performance Statistics
                  </h3>
                  <p className="text-sm text-slate-500">
                    Your administrative activity overview
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-200/50 to-transparent rounded-full transform translate-x-10 -translate-y-10"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500 shadow-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-indigo-900">
                          {profile.stats.totalDriversManaged}
                        </div>
                        <div className="text-sm font-medium text-indigo-700">
                          Total
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-indigo-800">
                      Drivers Managed
                    </div>
                    <div className="text-sm text-indigo-600 mt-1">
                      Active team members under your supervision
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/50 to-transparent rounded-full transform translate-x-10 -translate-y-10"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-green-500 shadow-lg flex items-center justify-center">
                        <Send className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-900">
                          {profile.stats.totalInvitationsSent}
                        </div>
                        <div className="text-sm font-medium text-green-700">
                          Sent
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-green-800">
                      Invitations Sent
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      Driver recruitment invitations issued
                    </div>
                  </div>
                </div>

                {profile.stats.lastLogin && (
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-6 hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200/50 to-transparent rounded-full transform translate-x-10 -translate-y-10"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-orange-500 shadow-lg flex items-center justify-center">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-orange-800">
                        Last Login
                      </div>
                      <div className="text-sm font-medium text-orange-900 mt-2">
                        {new Date(profile.stats.lastLogin).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-orange-600 mt-1">
                        {new Date(profile.stats.lastLogin).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
