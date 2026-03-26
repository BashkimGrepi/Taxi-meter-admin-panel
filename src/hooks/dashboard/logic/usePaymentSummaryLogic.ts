import { useMemo } from "react";
import { PaymentSummaryResponse } from "../../../types/dashboard";

export const usePaymentSummaryLogic = (
  data: PaymentSummaryResponse | undefined,
  isLoading: boolean,
) => {
  const paymentData = useMemo(() => {
    if (!data) {
      return {
        paid: 0,
        pending: 0,
        failed: 0,
        refunded: 0,
        vivaAmount: 0,
        cashAmount: 0,
        vivaPercentage: 0,
        cashPercentage: 0,
        currency: "€",
      };
    }

    // Get status counts
    const paid = data.counts.paid;
    const pending = data.counts.pending;
    const failed = data.counts.failed;
    const refunded = data.counts.refunded;

    // Get method breakdown
    const vivaAmount = data.breakdown.method.viva.amount;
    const cashAmount = data.breakdown.method.cash.amount;
    const totalAmount = vivaAmount + cashAmount;

    const vivaPercentage =
      totalAmount > 0 ? (vivaAmount / totalAmount) * 100 : 0;
    const cashPercentage =
      totalAmount > 0 ? (cashAmount / totalAmount) * 100 : 0;

    return {
      paid,
      pending,
      failed,
      refunded,
      vivaAmount,
      cashAmount,
      vivaPercentage,
      cashPercentage,
      currency: data.currency,
    };
  }, [data]);

  return {
    paymentData,
    isLoading,
  };
};
