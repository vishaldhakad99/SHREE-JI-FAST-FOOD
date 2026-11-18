import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useSettings();

  const whatsappUrl = getWhatsAppUrl(
    'Hello Shree Ji Fast Food! I would like to inquire about today’s fresh meals and menu.',
    settings?.whatsappNumber || settings?.phoneNumber
  );

  return (
    <aside aria-label="Customer Support">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group font-medium"
        title="Chat on WhatsApp"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white animate-pulse" />
        <span className="hidden sm:inline text-sm font-semibold tracking-wide">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  );
};
