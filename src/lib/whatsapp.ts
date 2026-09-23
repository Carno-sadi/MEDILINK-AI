import { CartItem, Doctor, Profile } from "@/types";

const DEFAULT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801811389672";

export function createWhatsAppUrl(
  message: string,
  phoneNumber: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * 12.1 Pharmacy Order Template (Content Sheet v2 §12.1)
 */
export function generatePharmacyOrderMessage(params: {
  profile: Partial<Profile>;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
}): string {
  const { profile, items, subtotal, discount, discountPercent, total } = params;

  const itemsList = items
    .map((item) => `• ${item.name} (x${item.quantity}) = ৳${item.price * item.quantity}`)
    .join("\n");

  return `*MediLink Pharmacy Order*
*Name:* ${profile.name || "Guest"}
*Phone:* ${profile.phone || "Not provided"}
*Address:* ${profile.area || "Not specified"}
*Items:*
${itemsList}
*Subtotal:* ৳${subtotal}
*Discount (${discountPercent}%):* -৳${discount}
*Delivery:* ৳30
*Total:* ৳${total}
Please confirm availability and delivery time.`;
}

/**
 * 12.2 Doctor Booking WhatsApp Chat Template (Content Sheet v2 §12.2)
 */
export function generateDoctorBookingMessage(params: {
  profile: Partial<Profile>;
  doctor: Doctor;
  selectedTime?: string;
  symptoms?: string;
  isPremium?: boolean;
}): string {
  const { profile, doctor, selectedTime, symptoms, isPremium } = params;
  const allergiesStr =
    profile.allergies && profile.allergies.length > 0
      ? profile.allergies.join(", ")
      : "None";

  return `*MediLink Doctor Booking*
*Patient:* ${profile.name || "Guest"}
*Phone:* ${profile.phone || "Not provided"}
*Doctor:* ${doctor.name}
*Specialty:* ${doctor.specialty}
*Consultation Type:* WhatsApp Chat
*Fee:* ৳${doctor.feeWhatsapp}
*Preferred Time:* ${selectedTime || doctor.availability || "Any time"}
*Symptoms:* ${symptoms || "General Consultation"}
*Known Allergies:* ${allergiesStr}
*Plan:* ${isPremium ? "Premium" : "Free"}
Please confirm my appointment.`;
}

/**
 * 12.3 Doctor Booking Video Call Template (Content Sheet v2 §12.3)
 */
export function generateDoctorVideoBookingMessage(params: {
  profile: Partial<Profile>;
  doctor: Doctor;
  selectedDate?: string;
  selectedTime?: string;
  symptoms?: string;
  isPremium?: boolean;
}): string {
  const { profile, doctor, selectedDate, selectedTime, symptoms, isPremium } = params;
  const allergiesStr =
    profile.allergies && profile.allergies.length > 0
      ? profile.allergies.join(", ")
      : "None";

  return `*MediLink Video Consultation Request*
*Patient:* ${profile.name || "Guest"}
*Phone:* ${profile.phone || "Not provided"}
*Doctor:* ${doctor.name}
*Specialty:* ${doctor.specialty}
*Consultation Type:* Video Call
*Fee:* ৳${doctor.feeVideo}
*Preferred Date:* ${selectedDate || "Tomorrow"}
*Preferred Time:* ${selectedTime || "Evening"}
*Symptoms:* ${symptoms || "General Consultation"}
*Known Allergies:* ${allergiesStr}
*Plan:* ${isPremium ? "Premium" : "Free"}
Please schedule my video consultation.`;
}

/**
 * 12.4 Premium Subscription Request Template (Content Sheet v2 §12.4)
 */
export function generatePremiumRequestMessage(params: {
  profile?: Partial<Profile>;
  currentPlan?: string;
}): string {
  const { profile, currentPlan = "Free" } = params;

  return `*MediLink Premium Subscription Request*
*Name:* ${profile?.name || "Guest"}
*Phone:* ${profile?.phone || "Not provided"}
*Current Plan:* ${currentPlan}
*Requested Plan:* Premium (৳500/month)
Please activate my Premium subscription. I will complete the payment as instructed.`;
}

/**
 * 12.5 Emergency SOS Alert Template (Content Sheet v2 §12.5)
 */
export function generateEmergencyAlertMessage(params: {
  profile?: Partial<Profile>;
  lat?: number;
  lng?: number;
}): string {
  const { profile, lat, lng } = params;
  const locationUrl =
    lat !== undefined && lng !== undefined
      ? `https://maps.google.com/?q=${lat},${lng}`
      : "Location not available";

  const allergiesStr =
    profile?.allergies && profile.allergies.length > 0
      ? profile.allergies.join(", ")
      : "None";

  const diseasesStr =
    profile?.diseases && profile.diseases.length > 0
      ? profile.diseases.join(", ")
      : "None";

  return `*MediLink Emergency Alert*
*Name:* ${profile?.name || "Guest"}
*Phone:* ${profile?.phone || "Not provided"}
*Location:* ${locationUrl}
*Known Allergies:* ${allergiesStr}
*Known Conditions:* ${diseasesStr}
URGENT: Please send help immediately.`;
}
