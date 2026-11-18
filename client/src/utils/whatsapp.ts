export const DEFAULT_WHATSAPP_NUMBER = '8839290150';

export const formatIndianPhoneForWhatsApp = (raw?: string): string => {
  const digits = (raw || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return `91${DEFAULT_WHATSAPP_NUMBER}`;
};

export const getWhatsAppUrl = (message: string, rawPhone?: string): string => {
  const phone = formatIndianPhoneForWhatsApp(rawPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
