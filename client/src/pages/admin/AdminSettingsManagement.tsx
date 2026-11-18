import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import {
  Sliders,
  Save,
  Check,
  AlertCircle,
  Building,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Truck,
  ShoppingBag,
  Bell,
  Globe,
} from 'lucide-react';

export const AdminSettingsManagement: React.FC = () => {
  const { settings, refreshSettings } = useSettings();

  const [restaurantName, setRestaurantName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState('');
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(false);
  const [isPickupAvailable, setIsPickupAvailable] = useState(true);
  const [aboutText, setAboutText] = useState('');
  const [specialitiesText, setSpecialitiesText] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [noticeBannerEnabled, setNoticeBannerEnabled] = useState(false);
  const [noticeBannerText, setNoticeBannerText] = useState('');

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (settings) {
      setRestaurantName(settings.restaurantName || '');
      setTagline(settings.tagline || '');
      setLogoUrl(settings.logoUrl || '');
      setPhoneNumber(settings.phoneNumber || '');
      setWhatsappNumber(settings.whatsappNumber || '');
      setEmail(settings.email || '');
      setAddress(settings.address || '');
      setOpeningHours(settings.openingHours || '');
      setGoogleMapsEmbedUrl(settings.googleMapsEmbedUrl || '');
      setIsDeliveryAvailable(settings.isDeliveryAvailable ?? false);
      setIsPickupAvailable(settings.isPickupAvailable ?? true);
      setAboutText(settings.aboutText || '');
      setSpecialitiesText(settings.specialitiesText || '');
      setInstagram(settings.socialLinks?.instagram || '');
      setFacebook(settings.socialLinks?.facebook || '');
      setNoticeBannerEnabled(settings.noticeBanner?.enabled ?? false);
      setNoticeBannerText(settings.noticeBanner?.text || '');
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    try {
      setSaving(true);
      const payload = {
        restaurantName: restaurantName.trim(),
        tagline: tagline.trim(),
        logoUrl: logoUrl.trim() || undefined,
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        openingHours: openingHours.trim(),
        googleMapsEmbedUrl: googleMapsEmbedUrl.trim() || undefined,
        isDeliveryAvailable,
        isPickupAvailable,
        aboutText: aboutText.trim(),
        specialitiesText: specialitiesText.trim(),
        socialLinks: {
          instagram: instagram.trim() || undefined,
          facebook: facebook.trim() || undefined,
        },
        noticeBanner: {
          enabled: noticeBannerEnabled,
          text: noticeBannerText.trim(),
        },
      };

      const res = await api.put('/settings', payload);

      if (res.data?.success) {
        setStatusMsg({ text: 'Restaurant settings updated successfully in database!', type: 'success' });
        await refreshSettings();
      } else {
        setStatusMsg({ text: res.data?.message || 'Failed to update settings.', type: 'error' });
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to update settings.';
      setStatusMsg({ text: msg, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-sm">
        <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider block">
          Configuration & Profile
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-950 mt-1">
          Restaurant Settings
        </h1>
        <p className="text-xs sm:text-sm text-deepbrown-muted mt-0.5">
          Update restaurant contact information, address, operating hours, delivery availability, and top announcement banner.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-red-50 text-red-800 border border-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Business Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
            <Building className="w-5 h-5 text-saffron-600" />
            <span>Brand Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Main Tagline
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Numbers & WhatsApp */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
            <Phone className="w-5 h-5 text-saffron-600" />
            <span>Contact & WhatsApp Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Phone Number (Calls)
              </label>
              <input
                type="text"
                required
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                WhatsApp Order Number
              </label>
              <input
                type="text"
                required
                placeholder="919876543210 (with country code)"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
              />
              <span className="text-[10px] text-deepbrown-muted block mt-1">
                Used for direct customer chat links.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="contact@shreejifastfood.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Address & Operating Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-saffron-600" />
            <span>Address & Kitchen Timings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Restaurant Physical Address
              </label>
              <textarea
                rows={3}
                required
                placeholder="Shop No., Street Name, Landmark, City, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                  Operating / Kitchen Hours
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mon - Sun: 08:00 AM - 10:00 PM"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                  Google Maps Embed URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://www.google.com/maps/embed?..."
                  value={googleMapsEmbedUrl}
                  onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Service Availability Toggles */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
            <Truck className="w-5 h-5 text-saffron-600" />
            <span>Service Availability Toggles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <label className="p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer border-cream-300 bg-cream-50">
              <div className="space-y-0.5">
                <span className="font-bold text-deepbrown-900 block">Self Pickup / Takeaway</span>
                <span className="text-xs text-deepbrown-muted">Allow customers to choose self-pickup option</span>
              </div>
              <input
                type="checkbox"
                checked={isPickupAvailable}
                onChange={(e) => setIsPickupAvailable(e.target.checked)}
                className="w-5 h-5 accent-saffron-600 rounded"
              />
            </label>

            <label className="p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer border-cream-300 bg-cream-50">
              <div className="space-y-0.5">
                <span className="font-bold text-deepbrown-900 block">Home Delivery</span>
                <span className="text-xs text-deepbrown-muted">
                  Enable only when restaurant delivery rider is active
                </span>
              </div>
              <input
                type="checkbox"
                checked={isDeliveryAvailable}
                onChange={(e) => setIsDeliveryAvailable(e.target.checked)}
                className="w-5 h-5 accent-saffron-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Section 5: Notice Announcement Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-saffron-600" />
            <span>Website Notice Announcement Banner</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={noticeBannerEnabled}
                onChange={(e) => setNoticeBannerEnabled(e.target.checked)}
                className="accent-saffron-600"
              />
              <span className="font-bold text-deepbrown-900">
                Display top banner across all pages
              </span>
            </label>

            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Announcement Message Text
              </label>
              <input
                type="text"
                placeholder="e.g. Special Gajar Ka Halwa available today! | Advance booking for Sunday Thalis open."
                value={noticeBannerText}
                onChange={(e) => setNoticeBannerText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 6: About & Specialities Text */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-saffron-600" />
            <span>About & Specialities Descriptions</span>
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                About Restaurant Text (Appears on About page & Footer)
              </label>
              <textarea
                rows={4}
                required
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                Specialities Description Text
              </label>
              <textarea
                rows={3}
                required
                value={specialitiesText}
                onChange={(e) => setSpecialitiesText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-deepbrown-900 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
