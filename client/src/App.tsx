import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CustomerAuthModal } from './components/CustomerAuthModal';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { TodaysSpecialPage } from './pages/TodaysSpecialPage';
import { SpecialitiesPage } from './pages/SpecialitiesPage';
import { CustomOrderPage } from './pages/CustomOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminFoodManagement } from './pages/admin/AdminFoodManagement';
import { AdminDailyMenuManagement } from './pages/admin/AdminDailyMenuManagement';
import { AdminOrdersManagement } from './pages/admin/AdminOrdersManagement';
import { AdminContactManagement } from './pages/admin/AdminContactManagement';
import { AdminSettingsManagement } from './pages/admin/AdminSettingsManagement';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <SettingsProvider>
          <BrowserRouter>
            <CustomerAuthModal />
            <Routes>
            {/* Customer Facing Website */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="todays-special" element={<TodaysSpecialPage />} />
              <Route path="specialities" element={<SpecialitiesPage />} />
              <Route path="custom-order" element={<CustomOrderPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Portal */}
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="food" element={<AdminFoodManagement />} />
              <Route path="daily-menu" element={<AdminDailyMenuManagement />} />
              <Route path="orders" element={<AdminOrdersManagement />} />
              <Route path="contacts" element={<AdminContactManagement />} />
              <Route path="settings" element={<AdminSettingsManagement />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </CustomerAuthProvider>
  </AuthProvider>
  );
};

export default App;
