import React, { useState } from 'react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Food Inquiry');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const whatsappUrl = getWhatsAppUrl(
    'Hello Shree Ji Fast Food, I have an inquiry.',
    settings?.whatsappNumber || settings?.phoneNumber
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please provide a valid phone number.');
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setErrorMsg('Please enter a message (at least 5 characters).');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/contact', {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      if (res.data?.success) {
        setSuccessMsg(res.data.message || 'Your inquiry has been received! We will get back to you shortly.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMsg(res.data?.message || 'Failed to send message.');
      }
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'An error occurred while sending your message.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-50 px-3.5 py-1 rounded-full border border-saffron-200">
          We Would Love to Hear From You
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-deepbrown-950">
          Contact Shree Ji Fast Food
        </h1>
        <p className="text-sm sm:text-base text-deepbrown-muted leading-relaxed">
          Have questions about our daily menu, custom cooking, bulk orders, or takeaway timings? Reach out directly via phone, WhatsApp, or through the contact form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-premium space-y-6">
            <h3 className="font-serif font-bold text-xl text-deepbrown-900 border-b border-cream-200 pb-3">
              Restaurant Details
            </h3>

            <div className="space-y-5 text-xs sm:text-sm text-deepbrown-800">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-deepbrown-900 font-bold mb-0.5">Location & Address</strong>
                  <p className="text-deepbrown-muted leading-relaxed">
                    {settings?.address || 'Restaurant address editable in Admin Settings'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-deepbrown-900 font-bold mb-0.5">Phone Number</strong>
                  <p className="text-deepbrown-muted">
                    {settings?.phoneNumber || 'Contact number editable in Admin Settings'}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-deepbrown-900 font-bold mb-0.5">WhatsApp Orders</strong>
                  <p className="text-deepbrown-muted mb-1 font-semibold">
                    {settings?.whatsappNumber ? `+91 ${settings.whatsappNumber}` : '+91 8839290150'}
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
                  >
                    <span>Click to chat on WhatsApp</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-deepbrown-900 font-bold mb-0.5">Kitchen Hours</strong>
                  <p className="text-deepbrown-muted">
                    {settings?.openingHours || 'Mon - Sun: 08:00 AM - 10:00 PM'}
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                    Open all 7 days for fresh meals
                  </span>
                </div>
              </div>

              {/* Email if available */}
              {settings?.email && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-deepbrown-900 font-bold mb-0.5">Email</strong>
                    <p className="text-deepbrown-muted">{settings.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Google Maps Embed / Map Placeholder */}
          <div className="bg-white rounded-3xl p-4 border border-cream-300 shadow-premium overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-deepbrown-800 mb-3 px-2">
              <MapPin className="w-4 h-4 text-saffron-600" />
              <span>Map & Location Pin</span>
            </div>

            {settings?.googleMapsEmbedUrl ? (
              <iframe
                title="Restaurant Location"
                src={settings.googleMapsEmbedUrl}
                className="w-full h-56 rounded-2xl border-0"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-56 bg-cream-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-2 border border-cream-300">
                <MapPin className="w-8 h-8 text-saffron-600 animate-bounce" />
                <span className="text-xs font-bold text-deepbrown-900">
                  {settings?.restaurantName || 'Shree Ji Fast Food'} Location Pin
                </span>
                <p className="text-[11px] text-deepbrown-muted max-w-xs leading-relaxed">
                  {settings?.address || 'Restaurant address is editable in Admin Settings. (Interactive map embed can be configured in admin).'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-premium space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 block mb-1">
                Drop us a note
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-900">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-deepbrown-muted mt-1">
                Fill in the form below and we will get back to you promptly.
              </p>
            </div>

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ankit Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. ankit@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daily Tiffin Inquiry / Bulk Paratha Order"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                Your Message / Inquiry <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Write your questions, catering requests, or dietary requirements here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
