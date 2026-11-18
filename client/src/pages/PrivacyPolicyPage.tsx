import React from 'react';
import { Shield, Lock, FileText, Phone } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-10">
        
        {/* Header */}
        <div className="text-center pb-8 border-b border-stone-200">
          <div className="inline-flex p-3 rounded-2xl bg-orange-100 text-orange-600 mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900">Privacy Policy</h1>
          <p className="text-stone-600 font-medium mt-1">Shree Ji Fast Food Application</p>
          <p className="text-xs text-stone-400 mt-2">Last updated: November 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 mt-8 text-stone-700 text-sm sm:text-base leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-orange-600" />
              1. Overview
            </h2>
            <p>
              Welcome to <strong>Shree Ji Fast Food</strong> ("we", "our", or "us"). We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how our mobile and web application collects, uses, and safeguards customer data when you browse our menu and place food orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-orange-600" />
              2. Information We Collect
            </h2>
            <p className="mb-2">We collect only minimal information necessary to deliver quality food service:</p>
            <ul className="list-disc pl-6 space-y-1 text-stone-600">
              <li><strong>Phone Number & OTP:</strong> Used exclusively to authenticate your identity, prevent spam orders, and provide live order notifications.</li>
              <li><strong>Name & Delivery Address:</strong> Provided voluntarily during checkout for delivery coordination.</li>
              <li><strong>Order Inquiries:</strong> Details of dishes, thalis, or snacks selected to prepare and fulfill your meal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-orange-600" />
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-stone-600">
              <li>To prepare and fulfill your daily meals and fast food orders.</li>
              <li>To notify you via SMS, WhatsApp, and in-app sound notifications when your order is accepted or on the way.</li>
              <li>To maintain your secure session across app opens so you do not have to log in repeatedly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-orange-600" />
              4. Data Protection & Security
            </h2>
            <p>
              We implement industry-standard security measures including encrypted authentication tokens (JWT) and secure HTTPS transport. We never sell, rent, or trade your personal contact details to third-party advertising companies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-orange-600" />
              5. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to request data deletion, please contact us directly:
            </p>
            <div className="mt-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-stone-800">
              <p className="font-bold text-orange-900">Shree Ji Fast Food</p>
              <p className="text-sm text-stone-700 mt-1">Phone / WhatsApp: <a href="tel:8839290150" className="text-orange-600 font-semibold underline">8839290150</a></p>
              <p className="text-sm text-stone-700">Support: <a href="https://wa.me/918839290150" target="_blank" rel="noreferrer" className="text-orange-600 font-semibold underline">+91 8839290150</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
