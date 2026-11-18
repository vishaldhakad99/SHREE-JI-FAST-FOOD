import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { OrderEnquiry } from '../../types';
import {
  ShoppingBag,
  Search,
  Filter,
  Check,
  Clock,
  MessageCircle,
  Phone,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  X,
} from 'lucide-react';

export const AdminOrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<OrderEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Order for Modal View & Status Update
  const [selectedOrder, setSelectedOrder] = useState<OrderEnquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<'new' | 'contacted' | 'accepted' | 'rejected' | 'completed'>('new');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = `/orders?status=${statusFilter}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await api.get(url);
      if (res.data?.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openOrderModal = (order: OrderEnquiry) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAdminNotes(order.adminNotes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const res = await api.patch(`/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        adminNotes: adminNotes.trim() || undefined,
      });

      if (res.data?.success) {
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Error updating order status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[11px]">New Inquiry</span>;
      case 'contacted':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold text-[11px]">Contacted</span>;
      case 'accepted':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[11px]">Accepted</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold text-[11px]">Rejected</span>;
      case 'completed':
        return <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-bold text-[11px]">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-300 shadow-sm">
        <div>
          <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider block">
            Customer Inquiries
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-950 mt-1">
            Order Enquiries Management
          </h1>
          <p className="text-xs sm:text-sm text-deepbrown-muted mt-0.5">
            Review custom food requests, verify kitchen availability, and update customer order status.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { label: 'All', val: 'all' },
            { label: 'New', val: 'new' },
            { label: 'Contacted', val: 'contacted' },
            { label: 'Accepted', val: 'accepted' },
            { label: 'Completed', val: 'completed' },
            { label: 'Rejected', val: 'rejected' },
          ].map((pill) => (
            <button
              key={pill.val}
              onClick={() => setStatusFilter(pill.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                statusFilter === pill.val
                  ? 'bg-saffron-600 text-white shadow-sm'
                  : 'bg-cream-100 text-deepbrown-800 hover:bg-cream-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-deepbrown-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs sm:text-sm text-deepbrown-900 focus:outline-none"
          />
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-deepbrown-muted">Loading inquiries...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cream-100 border-b border-cream-200 text-deepbrown-muted font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Food Item & Qty</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });
                  const cleanPhone = order.customerPhone.replace(/[^\d]/g, '');
                  const replyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${order.customerName}, this is Shree Ji Fast Food regarding your order for ${order.foodItemName} (Qty: ${order.quantity}).`)}`;

                  return (
                    <tr key={order._id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-3 px-4 text-deepbrown-muted text-xs whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-deepbrown-900 block">{order.customerName}</span>
                        <span className="text-xs text-deepbrown-muted flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.customerPhone}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-deepbrown-900 block">{order.foodItemName}</span>
                        <span className="text-xs text-deepbrown-muted">Quantity: {order.quantity}</span>
                        {order.additionalRequirements && (
                          <span className="block text-[11px] text-saffron-800 line-clamp-1 italic mt-0.5">
                            "{order.additionalRequirements}"
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 capitalize font-semibold text-deepbrown-800">
                        {order.deliveryType}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={replyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
                            title="Reply on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-white" />
                          </a>

                          <button
                            onClick={() => openOrderModal(order)}
                            className="px-3 py-1.5 rounded-lg bg-saffron-50 text-saffron-700 hover:bg-saffron-100 font-bold text-xs transition-colors"
                          >
                            Details / Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-deepbrown-muted">
            No order inquiries found matching your selection.
          </div>
        )}
      </div>

      {/* Details & Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-cream-300">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-serif font-black text-xl text-deepbrown-900">
                Order Inquiry Details
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-deepbrown-muted hover:text-deepbrown-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm bg-cream-50 p-4 rounded-2xl border border-cream-200 text-deepbrown-900">
              <div className="flex justify-between">
                <span className="text-deepbrown-muted font-semibold">Customer:</span>
                <span className="font-bold">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-deepbrown-muted font-semibold">Phone:</span>
                <span className="font-bold">{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-deepbrown-muted font-semibold">Requested Dish:</span>
                <span className="font-bold">{selectedOrder.foodItemName} (Qty: {selectedOrder.quantity})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-deepbrown-muted font-semibold">Service Type:</span>
                <span className="font-bold capitalize">{selectedOrder.deliveryType}</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div>
                  <span className="text-deepbrown-muted font-semibold block mb-0.5">Delivery Address:</span>
                  <p className="bg-white p-2 rounded-lg border border-cream-300 text-xs">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
              )}
              {selectedOrder.additionalRequirements && (
                <div>
                  <span className="text-deepbrown-muted font-semibold block mb-0.5">Customization / Requirements:</span>
                  <p className="bg-white p-2 rounded-lg border border-cream-300 text-xs whitespace-pre-wrap">
                    {selectedOrder.additionalRequirements}
                  </p>
                </div>
              )}
            </div>

            {/* Status & Notes form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                  Update Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-xs sm:text-sm font-semibold text-deepbrown-900 focus:outline-none"
                >
                  <option value="new">New (Needs verification)</option>
                  <option value="contacted">Contacted Customer</option>
                  <option value="accepted">Accepted / Cooking in Kitchen</option>
                  <option value="completed">Completed / Handed Over</option>
                  <option value="rejected">Rejected (Out of stock or unavailable)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-deepbrown-900 mb-1">
                  Kitchen / Staff Notes (Internal)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Customer requested pickup at 1:30 PM. Prepared with extra butter."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs sm:text-sm text-deepbrown-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-deepbrown-800 bg-cream-200 hover:bg-cream-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updating}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 transition-colors disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
