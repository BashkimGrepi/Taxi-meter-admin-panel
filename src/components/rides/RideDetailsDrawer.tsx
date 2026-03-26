import {
  X,
  Loader2,
  AlertCircle,
  MapPin,
  CreditCard,
  Clock,
} from "lucide-react";
import { useRideDetail } from "../../hooks/rides/useRidesData";
import {
  formatRideDateTime,
  formatRideMoney,
  formatDistance,
  formatDuration,
  getRideStatusStyle,
  getPaymentStatusStyle,
} from "../../utils/rideHelpers";

interface RideDetailsDrawerProps {
  rideId: string | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Ride Details Drawer
 * - Opens on row click
 * - Fetches detailed ride data
 * - Shows ride, fare, and payment information
 */
export default function RideDetailsDrawer({
  rideId,
  open,
  onClose,
}: RideDetailsDrawerProps) {
  const { data: ride, isLoading, isError, error } = useRideDetail(rideId);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Ride Details
            </h2>
            {ride && (
              <p className="text-sm text-gray-500 mt-1">ID: {ride.id}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-sm text-gray-600">Loading ride details...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center h-64">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Could not load ride details
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                {error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {ride && !isLoading && !isError && (
            <div className="space-y-6">
              {/* Status & Basic Info */}
              <Section icon={Clock} title="Ride Information">
                <InfoRow label="Status">
                  <StatusBadge status={ride.status} />
                </InfoRow>
                <InfoRow label="Started">
                  {formatRideDateTime(ride.startedAt)}
                </InfoRow>
                <InfoRow label="Ended">
                  {formatRideDateTime(ride.endedAt)}
                </InfoRow>
                <InfoRow label="Duration">
                  {formatDuration(ride.durationMin)}
                </InfoRow>
                <InfoRow label="Distance">
                  {formatDistance(ride.distanceKm)}
                </InfoRow>
              </Section>

              {/* Driver */}
              <Section icon={MapPin} title="Driver">
                <InfoRow label="Name">
                  {ride.driver.firstName} {ride.driver.lastName}
                </InfoRow>
                <InfoRow label="Phone">{ride.driver.phone || "—"}</InfoRow>
                <InfoRow label="Email">{ride.driver.email}</InfoRow>
                <InfoRow label="Driver ID">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {ride.driver.id}
                  </code>
                </InfoRow>
              </Section>

              {/* Fare Breakdown */}
              <Section icon={CreditCard} title="Fare Breakdown">
                <InfoRow label="Subtotal">
                  {formatRideMoney(ride.fareSubtotal, ride.currency)}
                </InfoRow>
                <InfoRow label="Tax">
                  {formatRideMoney(ride.taxAmount, ride.currency)}
                </InfoRow>
                <div className="pt-2 border-t border-gray-200">
                  <InfoRow label="Total Fare">
                    <span className="text-lg font-bold text-gray-900">
                      {formatRideMoney(ride.fareTotal, ride.currency)}
                    </span>
                  </InfoRow>
                </div>
              </Section>

              {/* Payment Details */}
              {ride.payment ? (
                <Section icon={CreditCard} title="Payment Details">
                  <InfoRow label="Status">
                    <PaymentBadge status={ride.payment.status} />
                  </InfoRow>
                  <InfoRow label="Method">{ride.payment.method}</InfoRow>
                  <InfoRow label="Provider">{ride.payment.provider}</InfoRow>
                  {ride.payment.externalPaymentId && (
                    <InfoRow label="Transaction ID">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {ride.payment.externalPaymentId}
                      </code>
                    </InfoRow>
                  )}
                  <InfoRow label="Amount">
                    {formatRideMoney(
                      ride.payment.amount,
                      ride.payment.currency,
                    )}
                  </InfoRow>
                  {ride.payment.capturedAt && (
                    <InfoRow label="Captured At">
                      {formatRideDateTime(ride.payment.capturedAt)}
                    </InfoRow>
                  )}
                </Section>
              ) : (
                <Section icon={CreditCard} title="Payment Details">
                  <p className="text-sm text-gray-500">
                    No payment information available for this ride.
                  </p>
                </Section>
              )}

              {/* Pricing Policy (if available) */}
              {ride.pricingPolicy && (
                <Section icon={CreditCard} title="Pricing Policy">
                  <InfoRow label="Policy Name">
                    {ride.pricingPolicy.name}
                  </InfoRow>
                  <InfoRow label="Base Fare">
                    {formatRideMoney(
                      ride.pricingPolicy.baseFare,
                      ride.currency,
                    )}
                  </InfoRow>
                  <InfoRow label="Per Minute">
                    {formatRideMoney(
                      ride.pricingPolicy.perMinute,
                      ride.currency,
                    )}
                  </InfoRow>
                  <InfoRow label="Per Km">
                    {formatRideMoney(ride.pricingPolicy.perKm, ride.currency)}
                  </InfoRow>
                </Section>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Section Component
 */
function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/**
 * Info Row Component
 */
function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm font-medium text-gray-600 min-w-[120px]">
        {label}:
      </span>
      <span className="text-sm text-gray-900 text-right flex-1">
        {children}
      </span>
    </div>
  );
}

/**
 * Status Badge
 */
function StatusBadge({ status }: { status: any }) {
  const style = getRideStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

/**
 * Payment Badge
 */
function PaymentBadge({ status }: { status: any }) {
  const style = getPaymentStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
