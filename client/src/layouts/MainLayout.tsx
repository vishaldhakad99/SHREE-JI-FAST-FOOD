import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ScrollToTop } from '../components/ScrollToTop';
import { CustomerOrderNotificationTracker } from '../components/CustomerOrderNotificationTracker';
import { MobileInstallPromptBanner } from '../components/MobileInstallPromptBanner';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-deepbrown-900 selection:bg-saffron-100 selection:text-saffron-800 overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <CustomerOrderNotificationTracker />
      <MobileInstallPromptBanner />
    </div>
  );
};
