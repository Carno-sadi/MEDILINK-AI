"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCartStore } from "@/stores/useCartStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { useToast } from "@/components/ui/Toast";
import { generatePharmacyOrderMessage, createWhatsAppUrl } from "@/lib/whatsapp";
import { Order } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const profile = useProfileStore((s) => s.profile);
  const isPremium = useSubscriptionStore((s) => s.isPremium());
  const { items, getSubtotal, getDiscount, getDeliveryFee, getTotal, clearCart } = useCartStore();
  const addOrder = useOrderStore((s) => s.addOrder);
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setDeliveryAddress(profile.area || "");
    }
  }, [profile, isOpen]);

  const subtotal = getSubtotal();
  const discount = getDiscount(isPremium);
  const discountPercent = isPremium ? 20 : 0;
  const delivery = getDeliveryFee();
  const total = getTotal(isPremium);

  const previewMessage = generatePharmacyOrderMessage({
    profile: {
      name,
      phone,
      area: deliveryAddress,
    },
    items,
    subtotal,
    discount,
    discountPercent,
    total,
  });

  const handleSendWhatsApp = () => {
    if (!name.trim() || !phone.trim() || !deliveryAddress.trim()) return;

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      items: [...items],
      subtotal,
      discount,
      deliveryFee: delivery,
      total,
      customerName: name,
      customerPhone: phone,
      deliveryAddress,
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);

    const url = createWhatsAppUrl(previewMessage);
    window.open(url, "_blank", "noopener,noreferrer");

    clearCart();
    showToast("Order request sent via WhatsApp!", "success");
    onClose();
    onOrderSuccess(orderId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Your Order">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <label className="block text-[14px] font-bold text-text-primary mb-1.5">
            Full Name
          </label>
          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-text-primary mb-1.5">
            Phone Number
          </label>
          <Input
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[14px] font-bold text-text-primary mb-1.5">
            Delivery Address / Area
          </label>
          <Input
            placeholder="Road, House, Area, City"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-text-muted uppercase tracking-wider mb-2">
            WhatsApp Message Preview:
          </label>
          <div className="bg-bg-soft border border-border-soft rounded-[12px] p-4 text-[13px] text-text-primary whitespace-pre-line font-mono leading-relaxed select-text">
            {previewMessage}
          </div>
        </div>
      </div>

      <div className="pt-5 mt-4 border-t border-border-soft flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="text-[14px] font-semibold text-text-muted hover:text-text-primary px-3 py-2"
        >
          Cancel
        </button>
        <Button
          size="m"
          onClick={handleSendWhatsApp}
          disabled={!name.trim() || !phone.trim() || !deliveryAddress.trim() || items.length === 0}
        >
          Send via WhatsApp
        </Button>
      </div>
    </Modal>
  );
};
