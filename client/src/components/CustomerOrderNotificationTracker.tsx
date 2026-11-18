import React, { useEffect, useState, useRef } from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import api from '../services/api';
import {
  playOrderAcceptedChime,
  sendBrowserNotification,
  requestNotificationPermission,
} from '../utils/audioAlerts';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  Bell,
  CheckCircle2,
  Clock,
  ChefHat,
  MessageCircle,
  Phone,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface CustomerOrder {
  _id: string;
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  foodItemName: string;
  quantity: number;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  status: 'new' | 'contacted' | 'accepted' | 'rejected' | 'completed';
  estimatedTime?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const CustomerOrderNotificationTracker: React.FC = () => {
  const { customer, isAuthenticated } = useCustomerAuth();
  const [activeOrders, setActiveOrders] = useState<CustomerOrder[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [acceptedAlertOrder, setAcceptedAlertOrder] = useState<CustomerOrder | null>(null);

  // Store previously seen statuses to detect status transitions
  const previousStatusMap = useRef<{ [orderId: string]: string }>({});

  // Ask for browser notification permission once customer is logged in
  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const customerPhone = customer?.phone || localStorage.getItem('shreeji_last_order_phone');
    if (!customerPhone) return;

    let isMounted = true;

    const pollOrders = async () => {
      try {
        const res = await api.get(`/orders/my-orders?phone=${encodeURIComponent(customerPhone)}`);
        if (res.data?.success && isMounted) {
          const fetchedOrders: CustomerOrder[] = res.data.orders || [];

          // Filter for active orders (new, contacted, accepted)
          const active = fetchedOrders.filter(
            (o) => o.status === 'new' || o.status === 'contacted' || o.status === 'accepted'
          );
          setActiveOrders(active);

          // Detect status transitions
          fetchedOrders.forEach((order) => {
            const prevStatus = previousStatusMap.current[order._id];

            // If status transitioned from 'new'/'contacted' -> 'accepted'
            if (prevStatus && (prevStatus === 'new' || prevStatus === 'contacted') && order.status === 'accepted') {
              console.log('[Notification] Order Accepted by Admin:', order);
              
              // 1. Play joyful chime on customer's phone
              playOrderAcceptedChime();

              // 2. Trigger native push notification
              sendBrowserNotification('🎉 Order Accepted by Shree Ji Fast Food!', {
                body: `Your order for ${order.foodItemName} has been accepted! Kitchen is preparing your hot meal.`,
              });

              // 3. Show prominent popup alert
              setAcceptedAlertOrder(order);
              setMinimized(false);
            }

            // Update status map
            previousStatusMap.current[order._id] = order.status;
          });
        }
      } catch (err) {
        // Silently retry on next tick
      }
    };

    // Poll immediately and every 5 seconds
    pollOrders();
    const interval = setInterval(pollOrders, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [customer?.phone]);

  if (activeOrders.length === 0 && !acceptedAlertOrder) return null;

  const currentOrder = acceptedAlertOrder || activeOrders[0];
  if (!currentOrder) return null;

  const isAccepted = currentOrder.status === 'accepted';
  const whatsappUrl = getWhatsAppUrl(
    `Hello Shree Ji Fast Food, I am inquiring about my active order #${currentOrder.orderNumber || ''} (${currentOrder.foodItemName}).`
  );

  return (
    <>
      {/* 1. Modal Alert when Admin just accepted the order */}
      {acceptedAlertOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-emerald-400 relative overflow-hidden animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <ChefHat className="w-9 h-9 animate-bounce" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Order Accepted by Restaurant!
            </span>

            <h3 className="text-xl font-serif font-black text-deepbrown-900 mb-1">
              Khana Tayyar Ho Raha Hai! 🍲
            </h3>

            <p className="text-xs text-stone-600 mb-4">
              Shree Ji Fast Food kitchen has accepted your order{' '}
              <strong>#{currentOrder.orderNumber || ''}</strong> for{' '}
              <strong>{currentOrder.foodItemName}</strong>.
            </p>

            {currentOrder.estimatedTime && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-xs font-bold text-amber-900">
                ⏱️ Estimated Time: {currentOrder.estimatedTime}
              </div>
            )}

            <button
              onClick={() => setAcceptedAlertOrder(null)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
            >
              Great, Track My Order!
            </button>
          </div>
        </div>
      )}

      {/* 2. Persistent Floating Order Status Bar on bottom right */}
      <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full px-3 sm:px-0">
        <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden transition-all">
          {/* Top Header Bar */}
          <div
            onClick={() => setMinimized(!minimized)}
            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
              isAccepted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                : 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span className="font-bold text-xs uppercase tracking-wider">
                {isAccepted ? '✓ Order Accepted & Preparing' : '⏳ Order Sent to Kitchen'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                #{currentOrder.orderNumber || 'SJ-ORD'}
              </span>
              {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {/* Collapsible Content */}
          {!minimized && (
            <div className="p-4 space-y-3 bg-stone-50">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-deepbrown-900 leading-tight">
                    {currentOrder.foodItemName}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Qty: {currentOrder.quantity} • {currentOrder.deliveryType === 'delivery' ? 'Home Delivery' : 'Self Pickup'}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isAccepted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isAccepted ? 'Preparing' : 'Pending Review'}
                </span>
              </div>

              {/* Step Progress Indicator */}
              <div className="grid grid-cols-3 gap-1 pt-2 pb-1 text-center text-[10px] font-bold">
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-emerald-500 rounded-full" />
                  <span className="text-emerald-700">1. Placed</span>
                </div>
                <div className="space-y-1">
                  <div
                    className={`h-1.5 w-full rounded-full ${
                      isAccepted ? 'bg-emerald-500 animate-pulse' : 'bg-stone-200'
                    }`}
                  />
                  <span className={isAccepted ? 'text-emerald-700 font-extrabold' : 'text-stone-400'}>
                    2. Accepted
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-stone-200 rounded-full" />
                  <span className="text-stone-400">3. Ready</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
                <a
                  href="tel:8839290150"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                  <span>Call 8839290150</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
