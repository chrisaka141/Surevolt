export type Department = 'generators' | 'ac' | 'sumo';

export type IssueCategory = 'servicing' | 'overhauling' | 'repair' | 'installation';

export type DeliveryMode = 'home_service' | 'pickup_return' | 'workshop_dropoff';

export type OrderStatus =
  | 'request_received'
  | 'picked_up'
  | 'diagnostic'
  | 'in_repair'
  | 'quality_tested'
  | 'ready_delivered';

export type PaymentStatus = 'unpaid' | 'paid_online' | 'pay_on_arrival';

export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'pay_on_arrival';

export interface TimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface RepairOrder {
  id: string;
  userId?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  department: Department;
  equipmentModel?: string;
  issueCategory: IssueCategory;
  autoCategorizationReason?: string;
  issueDescription: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  photos: string[];
  deliveryMode: DeliveryMode;
  status: OrderStatus;
  trackingTimeline: TimelineEvent[];
  estimatedPrice: number;
  deliveryFee: number;
  overhaulingAdjustment?: number;
  overhaulingAdjustmentReason?: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
  receiptNumber?: string;
  inspectionNote?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type EquipmentCondition = 'brand_new' | 'fairly_used';

export interface EquipmentProduct {
  id: string;
  name: string;
  department: Department;
  condition: EquipmentCondition;
  brand: string;
  modelNumber: string;
  capacity: string;
  price: number;
  originalPrice?: number;
  conditionRating?: string; // e.g. "9.8/10 Grade-A Tested"
  specs: string[];
  images: string[];
  inStock: boolean;
  warranty: string;
  testedChecklist: string[];
  description: string;
}

export interface SellRequest {
  id: string;
  userId?: string;
  requestNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  department: Department;
  brandModel: string;
  workingCondition: 'not_working' | 'working_with_faults' | 'working_good';
  issueDescription: string;
  photos: string[];
  estimatedOfferRange: string;
  offeredPrice?: number;
  status: 'pending_review' | 'inspected' | 'offer_sent' | 'accepted' | 'declined';
  adminNotes?: string;
  createdAt: string;
}

export interface PricingConfig {
  servicingMin: number;
  servicingMax: number;
  overhaulingMin: number;
  overhaulingMax: number;
  homeServiceFee: number;
  pickupReturnFee: number;
  workshopDropoffFee: number;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  ctaText: string;
  ctaAction: 'book' | 'buy' | 'sell';
}

export interface BusinessSettings {
  companyName: string;
  tagline: string;
  contactPhone: string;
  alternatePhone: string;
  contactEmail: string;
  workshopAddress: string;
  workingHours: string; // "6:00 AM – 9:00 PM Daily"
  operatingSince: number; // 2015
  pricingConfig: PricingConfig;
  bannerSlides: BannerSlide[];
  announcementNotice: string;
  refundPolicyHours: number; // 24
  cancellationWindowHours: string; // "6–12 hours"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: string;
  avatar?: string;
}
