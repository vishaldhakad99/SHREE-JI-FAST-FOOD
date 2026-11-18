import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ContactEnquiry } from '../../types';
import { MessageSquare, Mail, Phone, CheckCircle, Clock, Eye, X } from 'lucide-react';

export const AdminContactManagement: React.FC = () => {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contact');
      if (res.data?.success) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error('Error fetching contact enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleMarkReplied = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'replied' ? 'read' : 'replied';
      await api.patch(`/contact/${id}`, { status: nextStatus, isRead: true });
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: nextStatus, isRead: true });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-sm">
        <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider block">
          Website Messages
        </span>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-950 mt-1">
          Contact Form Enquiries
        </h1>
        <p className="text-xs sm:text-sm text-deepbrown-muted mt-0.5">
          Messages and inquiries sent by visitors through the customer Contact Us page.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-cream-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-deepbrown-muted">Loading messages...</div>
        ) : enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cream-100 border-b border-cream-200 text-deepbrown-muted font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {enquiries.map((enq) => {
                  const dateStr = new Date(enq.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={enq._id}
                      className={`hover:bg-cream-50/70 transition-colors ${
                        !enq.isRead ? 'bg-amber-50/40 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-deepbrown-muted whitespace-nowrap">{dateStr}</td>
                      <td className="py-3 px-4">
                        <span className="text-deepbrown-900 block">{enq.name}</span>
                        <span className="text-[11px] text-deepbrown-muted">{enq.phone}</span>
                      </td>
                      <td className="py-3 px-4 text-deepbrown-800">{enq.subject || 'General'}</td>
                      <td className="py-3 px-4 text-deepbrown-muted max-w-xs truncate">
                        {enq.message}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            enq.status === 'replied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : !enq.isRead
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {enq.status === 'replied' ? 'Replied' : !enq.isRead ? 'Unread' : 'Read'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            if (!enq.isRead) {
                              api.patch(`/contact/${enq._id}`, { isRead: true });
                            }
                          }}
                          className="px-3 py-1 bg-saffron-50 text-saffron-700 hover:bg-saffron-100 rounded-lg text-xs font-bold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-deepbrown-muted">
            No contact inquiries found.
          </div>
        )}
      </div>

      {/* Modal View */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-cream-300">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-serif font-black text-xl text-deepbrown-900">
                Message from {selectedEnquiry.name}
              </h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-deepbrown-muted hover:text-deepbrown-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm bg-cream-50 p-4 rounded-2xl border border-cream-200">
              <div><strong>Phone:</strong> {selectedEnquiry.phone}</div>
              {selectedEnquiry.email && <div><strong>Email:</strong> {selectedEnquiry.email}</div>}
              <div><strong>Subject:</strong> {selectedEnquiry.subject || 'Inquiry'}</div>
            </div>

            <div>
              <span className="text-xs font-bold text-deepbrown-900 block mb-1">Message:</span>
              <p className="bg-white p-4 rounded-xl border border-cream-300 text-xs sm:text-sm text-deepbrown-800 whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => handleMarkReplied(selectedEnquiry._id, selectedEnquiry.status)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              >
                {selectedEnquiry.status === 'replied' ? 'Mark as Not Replied' : 'Mark as Replied'}
              </button>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-deepbrown-800 bg-cream-200 hover:bg-cream-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
