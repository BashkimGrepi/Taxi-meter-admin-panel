import { monthToPlainRange } from '../utils/dates'; // <- change import
import { axiosInstance } from './AxiosInstance';

export async function exportPaymentsPdf(params: { month: string; annex?: boolean }) {
  const { month, annex = false } = params;
  const { from, to } = monthToPlainRange(month); // <- use plain dates

  const response = await axiosInstance.get(`/admin/exports/payments.pdf`, {
    params: { from, to, type: 'simplified', annex: annex ? 1 : 0 },
    responseType: 'blob',
  });

  const cd = response.headers?.['content-disposition'] as string | undefined;
  const serverName = cd?.match(/filename="?([^"]+)"?/)?.[1];
  const filename = serverName ?? `payments-${month}.pdf`;
  return { blob: response.data as Blob, filename };
}
