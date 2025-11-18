import { Building2 } from "lucide-react";

interface CompanyInfoProps {
  companyInfo: {
    name: string;
    businessId: string;
    hasNoTenant: boolean;
  };
}

export const CompanyInfo = ({ companyInfo }: CompanyInfoProps) => (
  <div className="px-3 py-3">
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-slate-700 text-white flex items-center justify-center text-lg font-bold shadow-md">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900 truncate">
            {companyInfo.name}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            ID: {companyInfo.businessId}
          </div>
          {companyInfo.hasNoTenant && (
            <div className="text-xs text-amber-600 font-medium">
              No tenant selected
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
