import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface CustomerUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  authMethod: 'phone' | 'email';
}

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  sendOtp: (
    identifier: string,
    type: 'phone' | 'email',
    name?: string
  ) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (
    identifier: string,
    otp: string,
    name?: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('shreeji_customer_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Validate session on mount
  useEffect(() => {
    const checkCustomerAuth = async () => {
      const token = localStorage.getItem('shreeji_customer_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/customer/me');
        if (res.data.success && res.data.customer) {
          setCustomer(res.data.customer);
          localStorage.setItem('shreeji_customer_user', JSON.stringify(res.data.customer));
        }
      } catch (err: any) {
        // STRICT: Only clear if the server explicitly returns a 401 Unauthorized
        // Never log out the user on network timeout, phone offline, or server cold starts!
        if (err.response?.status === 401) {
          localStorage.removeItem('shreeji_customer_token');
          localStorage.removeItem('shreeji_customer_user');
          setCustomer(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkCustomerAuth();
  }, []);

  const openAuthModal = (onSuccess?: () => void) => {
    if (onSuccess) {
      setPendingCallback(() => onSuccess);
    } else {
      setPendingCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  const sendOtp = async (
    identifier: string,
    type: 'phone' | 'email',
    name?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/customer/send-otp', {
        identifier,
        type,
        name,
      });
      return {
        success: true,
        message: res.data.message || 'Verification code sent',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to send verification code. Please try again.',
      };
    }
  };

  const verifyOtp = async (
    identifier: string,
    otp: string,
    name?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/customer/verify-otp', {
        identifier,
        otp,
        name,
      });

      if (res.data.success && res.data.customer) {
        setCustomer(res.data.customer);
        localStorage.setItem('shreeji_customer_user', JSON.stringify(res.data.customer));
        if (res.data.token) {
          localStorage.setItem('shreeji_customer_token', res.data.token);
        }

        // Close modal and execute pending order callback if any
        setIsAuthModalOpen(false);
        if (pendingCallback) {
          pendingCallback();
          setPendingCallback(null);
        }

        return { success: true, message: 'Login successful' };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid verification code. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/customer/logout');
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('shreeji_customer_token');
      localStorage.removeItem('shreeji_customer_user');
      setCustomer(null);
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = (): CustomerAuthContextType => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
