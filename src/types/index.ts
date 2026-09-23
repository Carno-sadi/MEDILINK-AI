export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  stock: number;
  requiresRx: boolean;
  image: string;
  description: string;
}

export interface DoctorReview {
  userName: string;
  area: string;
  rating: number;
  comment: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  feeWhatsapp: number;
  feeVideo: number;
  whatsappNumber: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  bio: string;
  education: string[];
  availability: string;
  reviews: DoctorReview[];
  photo?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export interface Profile {
  name: string;
  phone: string;
  area: string;
  diseases: string[];
  allergies: string[];
  bloodGroup?: string;
  ageGroup?: string;
  gender?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  consentGiven: boolean;
}

export type PlanType = "free" | "premium";

export interface Subscription {
  plan: PlanType;
  activatedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  modelUsed: "med1-flash" | "med1-pro";
  messages: ChatMessage[];
  createdAt: number;
}

export interface CartItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  requiresRx?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  createdAt: string;
}
