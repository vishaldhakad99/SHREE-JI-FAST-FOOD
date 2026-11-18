import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { OrderEnquiry, DailyMenu } from '../../types';
import {
  UtensilsCrossed,
  CalendarDays,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalFoodItems: 0,
    availableFoodItems: 0,
    todayMenuItems: 0,
    totalOrders: 0,
    newOrders: 0,
    pendingOrders: 0,
  });

  const [todayMenu, setTodayMenu] = useState<DailyMenu | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);

      const [foodRes, menuRes, ordersRes, orderStatsRes] = await Promise.all([
        api.get('/food'),
        api.get('/daily-menu'),
        api.get('/orders?limit=5'),
        api.get('/orders/stats'),
      ]);

      const items = foodRes.data?.items || [];
      const availableItems = items.filter((i: any) => i.isAvailable);

      const menu = menuRes.data?.hasMenu ? menuRes.data.menu : null;
      setTodayMenu(menu);

      const orderStats = orderStatsRes.data?.stats || {};
      setStats({
        totalFoodItems: items.length,
        availableFoodItems: availableItems.length,
        todayMenuItems: menu?.items?.length || 0,
        totalOrders: orderStats.total || 0,
        newOrders: orderStats.new || 0,
        pendingOrders: orderStats.pending || 0,
      });

      setRecentOrders(ordersRes.data?.orders || []);
    } catch (err) {
      console.error('Error fetching dashboard overview stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: any) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOverviewData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-300 shadow-sm">
        <div>
          <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider block">
            Kitchen & Restaurant Management
          </span>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-950 mt-1">
            Welcome back, {user?.name || 'Manager'}!
          </h1>
          <p className="text-xs sm:text-sm text-deepbrown-muted mt-0.5">
            Real-time management for Shree Ji Fast Food daily orders, menu, and customer requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard/daily-menu"
            className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Today's Menu</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-deepbrown-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Total Food Items</span>
            <UtensilsCrossed className="w-4 h-4 text-saffron-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-deepbrown-950 font-serif">
            {stats.totalFoodItems}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {stats.availableFoodItems} Available in kitchen
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-deepbrown-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Specials</span>
            <Sparkles className="w-4 h-4 text-warmamber-500 fill-warmamber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-deepbrown-950 font-serif">
            {stats.todayMenuItems}
          </div>
          <span className="text-[11px] text-deepbrown-muted block">
            {todayMenu ? 'Live on website today' : 'No menu set for today yet'}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-deepbrown-muted">
            <span className="text-xs font-bold uppercase tracking-wider">New Inquiries</span>
            <AlertCircle className="w-4 h-4 text-saffron-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-saffron-700 font-serif">
            {stats.newOrders}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block">
            Needs response from staff
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-deepbrown-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Total Inquiries</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-deepbrown-950 font-serif">
            {stats.totalOrders}
          </div>
          <span className="text-[11px] text-deepbrown-muted block">
            Recorded in database
          </span>
        </div>
      </div>

      {/* Two Column Layout: Today's Menu Summary & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Menu Status */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-saffron-600" />
              <h2 className="font-serif font-bold text-lg text-deepbrown-900">
                Today's Daily Menu Status
              </h2>
            </div>
            <Link
              to="/admin/dashboard/daily-menu"
              className="text-xs font-bold text-saffron-700 hover:underline"
            >
              Edit
            </Link>
          </div>

          {todayMenu ? (
            <div className="space-y-3">
              <div className="bg-cream-100 p-3 rounded-xl border border-cream-200 text-xs text-deepbrown-800">
                <strong className="block text-saffron-800 font-bold mb-0.5">{todayMenu.title}</strong>
                {todayMenu.specialAnnouncement && (
                  <p className="text-deepbrown-muted italic">"{todayMenu.specialAnnouncement}"</p>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-deepbrown-800 block">
                  Dishes on today's board ({todayMenu.items.length}):
                </span>
                <div className="divide-y divide-cream-200">
                  {todayMenu.items.map((dish, i) => (
                    <div key={i} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-deepbrown-900 block">{dish.name}</span>
                        <span className="text-deepbrown-muted text-[11px]">{dish.category}</span>
                      </div>
                      <span className="font-bold text-saffron-700">₹{dish.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <Clock className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-xs text-deepbrown-muted">
                No active daily specials published for today yet.
              </p>
              <Link
                to="/admin/dashboard/daily-menu"
                className="inline-flex items-center gap-1.5 bg-saffron-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Today's Menu</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Recent Order Inquiries */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-saffron-600" />
              <h2 className="font-serif font-bold text-lg text-deepbrown-900">
                Recent Order Enquiries
              </h2>
            </div>
            <Link
              to="/admin/dashboard/orders"
              className="text-xs font-bold text-saffron-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-deepbrown-muted">Loading inquiries...</div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream-200 text-deepbrown-muted font-bold">
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Requested Item</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {recentOrders.map((order) => {
                    const cleanPhone = order.customerPhone.replace(/[^\d]/g, '');
                    const replyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${order.customerName}, this is regarding your order inquiry for ${order.foodItemName} at Shree Ji Fast Food!`)}`;

                    return (
                      <tr key={order._id} className="hover:bg-cream-50">
                        <td className="py-2.5 font-semibold text-deepbrown-900">
                          {order.customerName}
                          <span className="block text-[11px] text-deepbrown-muted font-normal">
                            {order.customerPhone}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {order.foodItemName}
                          <span className="block text-[11px] text-deepbrown-muted">Qty: {order.quantity}</span>
                        </td>
                        <td className="py-2.5 capitalize">{order.deliveryType}</td>
                        <td className="py-2.5">
                          <select
                            value={order.status}
                            onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                              order.status === 'new'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : order.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : order.status === 'contacted'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : order.status === 'completed'
                                ? 'bg-gray-100 text-gray-800 border-gray-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-2.5 text-right">
                          <a
                            href={replyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[#25D366] text-white px-2 py-1 rounded text-[11px] font-bold"
                            title="Reply on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>Reply</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-deepbrown-muted">
              No customer inquiries recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
