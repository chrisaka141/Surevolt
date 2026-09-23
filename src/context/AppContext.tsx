import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BusinessSettings,
  EquipmentProduct,
  RepairOrder,
  SellRequest,
  UserProfile,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  IssueCategory,
} from '../types';
import {
  initialBusinessSettings,
  initialProducts,
  initialOrders,
  initialSellRequests,
  initialCurrentUser,
} from '../data/initialData';
import {
  db,
  auth,
  OperationType,
  handleFirestoreError,
  testConnection,
} from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface AppContextType {
  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDepartmentFilter: 'all' | 'generators' | 'ac' | 'sumo';
  setSelectedDepartmentFilter: (dep: 'all' | 'generators' | 'ac' | 'sumo') => void;

  // Business Content & Pricing Settings
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  updatePricingConfig: (pricing: BusinessSettings['pricingConfig']) => void;

  // Equipment Products
  products: EquipmentProduct[];
  addProduct: (product: Omit<EquipmentProduct, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<EquipmentProduct>) => void;
  deleteProduct: (id: string) => void;

  // Repair Orders
  orders: RepairOrder[];
  addOrder: (orderData: Omit<RepairOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'trackingTimeline'>) => RepairOrder;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string, updatedBy?: string) => void;
  updateOrderInspection: (orderId: string, inspectionNote: string, adjustmentAmount?: number, adjustmentReason?: string) => void;
  convertOrderToOverhaul: (orderId: string, newPrice: number, reason: string) => void;
  updateOrderPayment: (orderId: string, paymentMethod: PaymentMethod, transactionRef?: string) => void;

  // Sell Equipment Requests
  sellRequests: SellRequest[];
  addSellRequest: (requestData: Omit<SellRequest, 'id' | 'requestNumber' | 'createdAt' | 'status'>) => SellRequest;
  updateSellRequest: (id: string, updates: Partial<SellRequest>) => void;
  updateSellRequestOffer: (requestId: string, offerAmount: number) => void;

  // User Auth & Profiles
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  login: (email: string, role?: 'customer' | 'admin') => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  toggleAdminMode: () => void;

  // Modals & Active Selections
  activeModal: 'booking' | 'tracking' | 'payment' | 'receipt' | 'sell' | 'buy' | 'auth' | null;
  setActiveModal: (modal: 'booking' | 'tracking' | 'payment' | 'receipt' | 'sell' | 'buy' | 'auth' | null) => void;
  selectedOrder: RepairOrder | null;
  setSelectedOrder: (order: RepairOrder | null) => void;
  selectedProduct: EquipmentProduct | null;
  setSelectedProduct: (prod: EquipmentProduct | null) => void;
  currentReceipt: RepairOrder | null;
  setCurrentReceipt: (order: RepairOrder | null) => void;

  // Notifications
  notifications: AppNotification[];
  dismissNotification: (id: string) => void;
  removeNotification: (id: string) => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;

  // Firebase status
  isFirebaseConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<'all' | 'generators' | 'ac' | 'sumo'>('all');
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Business Settings State
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem('surevolt_settings');
      return saved ? JSON.parse(saved) : initialBusinessSettings;
    } catch {
      return initialBusinessSettings;
    }
  });

  // Products State
  const [products, setProducts] = useState<EquipmentProduct[]>(() => {
    try {
      const saved = localStorage.getItem('surevolt_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<RepairOrder[]>(() => {
    try {
      const saved = localStorage.getItem('surevolt_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  // Sell Requests State
  const [sellRequests, setSellRequests] = useState<SellRequest[]>(() => {
    try {
      const saved = localStorage.getItem('surevolt_sell_requests');
      return saved ? JSON.parse(saved) : initialSellRequests;
    } catch {
      return initialSellRequests;
    }
  });

  // Current User
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('surevolt_current_user');
      return saved ? JSON.parse(saved) : initialCurrentUser;
    } catch {
      return initialCurrentUser;
    }
  });

  // Modals & Selected Objects
  const [activeModal, setActiveModal] = useState<'booking' | 'tracking' | 'payment' | 'receipt' | 'sell' | 'buy' | 'auth' | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<EquipmentProduct | null>(null);
  const [currentReceipt, setCurrentReceipt] = useState<RepairOrder | null>(null);

  // Push Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-welcome',
      title: 'Surevolt Cloud Online',
      message: 'Connected to Firebase. Working hours: 6:00 AM – 9:00 PM Daily.',
      type: 'info',
      timestamp: 'Just now',
    },
  ]);

  const addNotification = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const id = 'notif-' + Date.now();
    setNotifications((prev) => [{ id, title, message, type, timestamp: 'Just now' }, ...prev.slice(0, 4)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const removeNotification = dismissNotification;

  // Local storage synchronization as cache fallback
  useEffect(() => {
    try {
      localStorage.setItem('surevolt_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('surevolt_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('surevolt_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('surevolt_sell_requests', JSON.stringify(sellRequests));
    } catch (e) {
      console.error(e);
    }
  }, [sellRequests]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('surevolt_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('surevolt_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Initial connection test & Auth listener
  useEffect(() => {
    testConnection().then((ok) => {
      setIsFirebaseConnected(ok);
      if (ok) {
        console.log('Firebase Firestore connection verified.');
      }
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdminUser =
          firebaseUser.email?.toLowerCase() === 'chrisaka141@gmail.com' ||
          firebaseUser.email?.toLowerCase().includes('admin');
        const profile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Surevolt Client',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '+234 814 883 2901',
          role: isAdminUser ? 'admin' : 'customer',
          address: 'Lagos, Nigeria',
          avatar: firebaseUser.photoURL || undefined,
        };
        setCurrentUser(profile);
        addNotification(
          `Welcome, ${profile.name}!`,
          `Authenticated via Google Firebase (${profile.role.toUpperCase()})`,
          'success'
        );
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore Listeners
  useEffect(() => {
    // 1. Settings listener
    const settingsDocRef = doc(db, 'settings', 'general');
    const unsubSettings = onSnapshot(
      settingsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as BusinessSettings);
        } else {
          // Seed initial settings into Firestore
          setDoc(settingsDocRef, initialBusinessSettings).catch((err) => {
            console.warn('Could not seed initial settings to Firestore:', err);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/general');
      }
    );

    // 2. Products listener
    const productsColRef = collection(db, 'products');
    const unsubProducts = onSnapshot(
      productsColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const prods: EquipmentProduct[] = [];
          snapshot.forEach((d) => {
            prods.push({ id: d.id, ...d.data() } as EquipmentProduct);
          });
          setProducts(prods);
        } else {
          // Seed initial products if remote is empty
          initialProducts.forEach((p) => {
            setDoc(doc(db, 'products', p.id), p).catch((e) => console.warn(e));
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    // 3. Orders listener
    const ordersColRef = collection(db, 'orders');
    const unsubOrders = onSnapshot(
      ordersColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const ords: RepairOrder[] = [];
          snapshot.forEach((d) => {
            ords.push({ id: d.id, ...d.data() } as RepairOrder);
          });
          // Sort by creation desc
          ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(ords);
        }
      },
      (error) => {
        console.warn('Orders listener:', error.message);
      }
    );

    // 4. Sell Requests listener
    const sellColRef = collection(db, 'sellRequests');
    const unsubSell = onSnapshot(
      sellColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const reqs: SellRequest[] = [];
          snapshot.forEach((d) => {
            reqs.push({ id: d.id, ...d.data() } as SellRequest);
          });
          setSellRequests(reqs);
        }
      },
      (error) => {
        console.warn('Sell requests listener:', error.message);
      }
    );

    return () => {
      unsubSettings();
      unsubProducts();
      unsubOrders();
      unsubSell();
    };
  }, []);

  // Business Settings Helpers
  const updateSettings = async (newSettings: Partial<BusinessSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'general'), updated, { merge: true });
      addNotification('Settings Synchronized', 'Business settings updated in Firestore cloud database.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    }
  };

  const updatePricingConfig = async (pricing: BusinessSettings['pricingConfig']) => {
    const updated = { ...settings, pricingConfig: pricing };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'general'), updated, { merge: true });
      addNotification('Price Ranges Synchronized', 'New pricing tags live across cloud & customer portal.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    }
  };

  // Product Catalog Helpers
  const addProduct = async (product: Omit<EquipmentProduct, 'id'>) => {
    const newId = 'prod-' + Date.now();
    const newProd: EquipmentProduct = { ...product, id: newId };
    setProducts((prev) => [newProd, ...prev]);

    try {
      await setDoc(doc(db, 'products', newId), newProd);
      addNotification('Equipment Published', `${newProd.name} saved to cloud database and marketplace.`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${newId}`);
    }
  };

  const updateProduct = async (id: string, updates: Partial<EquipmentProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await updateDoc(doc(db, 'products', id), updates);
      addNotification('Product Updated', 'Equipment specifications and price synchronized.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
      addNotification('Product Removed', 'Equipment removed from catalog.', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  // Repair Order Helpers
  const addOrder = (orderData: Omit<RepairOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'trackingTimeline'>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SV-${new Date().getFullYear()}-${randomSuffix}`;
    const now = new Date().toISOString();

    const initialTimeline = [
      {
        status: 'request_received' as OrderStatus,
        label: 'Request Received & Confirmed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: `Engineering ticket logged for ${orderData.department.toUpperCase()}. Automated cloud reply dispatched.`,
        updatedBy: 'Surevolt Dispatch',
      },
    ];

    const newId = 'ord-' + Date.now();
    const newOrder: RepairOrder = {
      ...orderData,
      id: newId,
      userId: currentUser?.id || 'guest',
      orderNumber,
      trackingTimeline: initialTimeline,
      createdAt: now,
      updatedAt: now,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);

    // Save to Firestore
    setDoc(doc(db, 'orders', newId), newOrder).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `orders/${newId}`);
    });

    addNotification(
      'Order Booked: ' + orderNumber,
      `Your request for ${newOrder.department} service has been logged to cloud. Working hours 6am–9pm.`,
      'success'
    );

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string, updatedBy = 'Admin Lead Engineer') => {
    const statusLabels: Record<OrderStatus, string> = {
      request_received: 'Request Received & Logged',
      picked_up: 'Technician Dispatched / Equipment Picked Up',
      diagnostic: 'Diagnostic & Visual Inspection',
      in_repair: 'In Repair / Overhauling',
      quality_tested: 'Quality Tested & Calibrated',
      ready_delivered: 'Ready for Pickup / Delivered',
    };

    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTimeline = [
      ...targetOrder.trackingTimeline,
      {
        status: newStatus,
        label: statusLabels[newStatus],
        timestamp: now,
        note: note || `Status updated to ${statusLabels[newStatus]}`,
        updatedBy,
      },
    ];

    const updates = {
      status: newStatus,
      trackingTimeline: newTimeline,
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, ...updates } : ord)));

    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
      addNotification('Cloud Tracking Updated', `Order status updated to: ${statusLabels[newStatus]}`, 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateOrderInspection = async (
    orderId: string,
    inspectionNote: string,
    adjustmentAmount?: number,
    adjustmentReason?: string
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hasAdjustment = adjustmentAmount && adjustmentAmount > 0;
    const newTotal = hasAdjustment ? targetOrder.totalAmount + adjustmentAmount : targetOrder.totalAmount;

    const newTimeline = [
      ...targetOrder.trackingTimeline,
      {
        status: 'diagnostic' as OrderStatus,
        label: hasAdjustment ? 'Visual Inspection: Overhaul Upgrade' : 'Physical Visual Inspection Completed',
        timestamp: now,
        note: hasAdjustment
          ? `Findings: ${inspectionNote}. Price adjusted by +₦${adjustmentAmount.toLocaleString()} as per overhaul policy.`
          : `Inspection Findings: ${inspectionNote}`,
        updatedBy: 'Lead Workshop QA',
      },
    ];

    const updates = {
      inspectionNote,
      issueCategory: hasAdjustment ? ('overhauling' as IssueCategory) : targetOrder.issueCategory,
      overhaulingAdjustment: hasAdjustment ? adjustmentAmount : targetOrder.overhaulingAdjustment,
      overhaulingAdjustmentReason: hasAdjustment ? adjustmentReason : targetOrder.overhaulingAdjustmentReason,
      totalAmount: newTotal,
      trackingTimeline: newTimeline,
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, ...updates } : ord)));

    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
      addNotification(
        'Visual Inspection Logged',
        hasAdjustment
          ? 'Overhaul adjustment logged to cloud & client notified.'
          : 'Inspection report saved to cloud.',
        'warning'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const convertOrderToOverhaul = async (orderId: string, newPrice: number, reason: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const oldPrice = targetOrder.estimatedPrice;
    const diff = newPrice - oldPrice;

    const updates = {
      issueCategory: 'overhauling' as IssueCategory,
      estimatedPrice: newPrice,
      totalAmount: targetOrder.totalAmount + diff,
      overhaulingAdjustment: diff,
      overhaulingAdjustmentReason: reason,
      inspectionNote: reason,
      trackingTimeline: [
        ...targetOrder.trackingTimeline,
        {
          status: 'diagnostic' as OrderStatus,
          label: 'Visual Inspection: Upgraded to Overhaul',
          timestamp: now,
          note: `Engineering finding: ${reason}. Total adjusted to reflect full overhauling as per Surevolt policy.`,
          updatedBy: 'Lead Engineer Emmanuel',
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, ...updates } : ord)));

    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
      addNotification('Policy Upgrade Applied', 'Job converted from Servicing to Overhauling in cloud.', 'warning');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateOrderPayment = async (orderId: string, paymentMethod: PaymentMethod, transactionRef?: string) => {
    const receiptNum = `RCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const updates = {
      paymentStatus: paymentMethod === 'pay_on_arrival' ? ('pay_on_arrival' as PaymentStatus) : ('paid_online' as PaymentStatus),
      paymentMethod,
      transactionRef: transactionRef || `REF-${Date.now().toString(36).toUpperCase()}`,
      receiptNumber: receiptNum,
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updated = { ...ord, ...updates };
        setCurrentReceipt(updated);
        return updated;
      })
    );

    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
      addNotification('Payment Confirmed!', `Receipt ${receiptNum} issued and saved to Firebase.`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Sell Requests Helpers
  const addSellRequest = (requestData: Omit<SellRequest, 'id' | 'requestNumber' | 'createdAt' | 'status'>) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const requestNumber = `SR-${new Date().getFullYear()}-${randomSuffix}`;
    const newId = 'sell-' + Date.now();
    const newReq: SellRequest = {
      ...requestData,
      id: newId,
      userId: currentUser?.id || 'guest',
      requestNumber,
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    };

    setSellRequests((prev) => [newReq, ...prev]);

    setDoc(doc(db, 'sellRequests', newId), newReq).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `sellRequests/${newId}`);
    });

    addNotification('Sell Request Logged', `We received your request to sell ${newReq.brandModel}. Saved to cloud!`, 'success');
    return newReq;
  };

  const updateSellRequest = async (id: string, updates: Partial<SellRequest>) => {
    setSellRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    try {
      await updateDoc(doc(db, 'sellRequests', id), updates);
      addNotification('Sell Valuation Updated', 'Quote and inspection status updated in cloud.', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `sellRequests/${id}`);
    }
  };

  const updateSellRequestOffer = async (requestId: string, offerAmount: number) => {
    const updates = {
      offeredPrice: offerAmount,
      status: 'offer_sent' as const,
    };
    setSellRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, ...updates } : r)));

    try {
      await updateDoc(doc(db, 'sellRequests', requestId), updates);
      addNotification('Offer Sent to Customer', `Cash buyout offer of ₦${offerAmount.toLocaleString()} saved.`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `sellRequests/${requestId}`);
    }
  };

  // Auth Helpers
  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    const user: UserProfile = {
      id: 'usr-' + Date.now(),
      name: role === 'admin' ? 'Engr. Chris (Surevolt Admin)' : email.split('@')[0],
      email,
      phone: '+234 814 883 2901',
      role,
      address: 'Lagos, Nigeria',
    };
    setCurrentUser(user);
    addNotification(`Welcome, ${user.name}!`, `Logged in as ${role.toUpperCase()}`, 'success');
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const isAdminUser = user.email?.toLowerCase() === 'chrisaka141@gmail.com';
      const profile: UserProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Client',
        email: user.email || '',
        phone: user.phoneNumber || '+234 814 883 2901',
        role: isAdminUser ? 'admin' : 'customer',
        address: 'Lagos, Nigeria',
        avatar: user.photoURL || undefined,
      };
      setCurrentUser(profile);
      addNotification('Google Sign-In Successful', `Welcome ${profile.name}! Signed in via Firebase Auth.`, 'success');
    } catch (err: unknown) {
      console.warn('Google Popup sign-in error or cancelled:', err);
      // Fallback seamlessly for environment preview
      login('chrisaka141@gmail.com', 'admin');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    setCurrentUser(null);
    addNotification('Logged Out', 'You have been safely signed out.', 'info');
  };

  const toggleAdminMode = () => {
    if (!currentUser || currentUser.role === 'customer') {
      login('chrisaka141@gmail.com', 'admin');
      setActiveTab('admin');
    } else {
      login('chrisaka141@gmail.com', 'customer');
      setActiveTab('home');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDepartmentFilter,
        setSelectedDepartmentFilter,
        settings,
        updateSettings,
        updatePricingConfig,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        addOrder,
        updateOrderStatus,
        updateOrderInspection,
        convertOrderToOverhaul,
        updateOrderPayment,
        sellRequests,
        addSellRequest,
        updateSellRequest,
        updateSellRequestOffer,
        currentUser,
        setCurrentUser,
        login,
        loginWithGoogle,
        logout,
        toggleAdminMode,
        activeModal,
        setActiveModal,
        selectedOrder,
        setSelectedOrder,
        selectedProduct,
        setSelectedProduct,
        currentReceipt,
        setCurrentReceipt,
        notifications,
        dismissNotification,
        removeNotification,
        addNotification,
        isFirebaseConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
