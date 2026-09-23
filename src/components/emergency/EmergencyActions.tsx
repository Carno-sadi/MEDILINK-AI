"use client";

import React from "react";
import { Phone, MessageSquare, Share2 } from "lucide-react";
import { Profile } from "@/types";
import { generateEmergencyAlertMessage, createWhatsAppUrl } from "@/lib/whatsapp";
import { Coordinates } from "@/lib/geo";

interface EmergencyActionsProps {
  profile: Profile | null;
  coords: Coordinates | null;
  locationName?: string;
}

export const EmergencyActions: React.FC<EmergencyActionsProps> = ({
  profile,
  coords,
  locationName,
}) => {
  const mapsUrl = coords
    ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
    : "";

  const smsText = `EMERGENCY ALERT: I need immediate help. ${
    coords
      ? `My location: ${mapsUrl}`
      : locationName
      ? `Location: ${locationName}`
      : ""
  }`.trim();

  const handleShareWhatsApp = () => {
    const message = generateEmergencyAlertMessage({
      profile: profile || {},
      lat: coords?.latitude,
      lng: coords?.longitude,
    });

    const targetPhone = profile?.emergencyContact?.phone || "";
    const url = createWhatsAppUrl(message, targetPhone);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      {/* Action 1: Call 999 */}
      <a
        href="tel:999"
        className="bg-white border border-border-soft hover:border-emergency rounded-[16px] p-6 flex flex-col items-center text-center group transition-all duration-160 shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-emergency-soft text-emergency flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <Phone className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-[18px] text-text-primary mb-1">
          Call 999
        </h3>
        <p className="text-[14px] text-text-muted mb-4">
          National emergency hotline
        </p>
        <span className="mt-auto text-[13px] font-bold text-emergency group-hover:underline">
          Dial Now →
        </span>
      </a>

      {/* Action 2: Send Location SMS */}
      <a
        href={`sms:${profile?.emergencyContact?.phone || ""}?body=${encodeURIComponent(
          smsText
        )}`}
        className="bg-white border border-border-soft hover:border-brand-soft rounded-[16px] p-6 flex flex-col items-center text-center group transition-all duration-160 shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-brand-light text-brand flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-[18px] text-text-primary mb-1">
          Send Location SMS
        </h3>
        <p className="text-[14px] text-text-muted mb-4">
          Opens SMS app with your location
        </p>
        <span className="mt-auto text-[13px] font-bold text-brand group-hover:underline">
          Draft SMS →
        </span>
      </a>

      {/* Action 3: Share on WhatsApp */}
      <button
        type="button"
        onClick={handleShareWhatsApp}
        className="bg-white border border-border-soft hover:border-whatsapp rounded-[16px] p-6 flex flex-col items-center text-center group transition-all duration-160 shadow-sm cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-whatsapp-light text-whatsapp flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <Share2 className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-[18px] text-text-primary mb-1">
          Share on WhatsApp
        </h3>
        <p className="text-[14px] text-text-muted mb-4">
          Send location to emergency contact
        </p>
        <span className="mt-auto text-[13px] font-bold text-whatsapp group-hover:underline">
          Share on WhatsApp →
        </span>
      </button>
    </div>
  );
};
