"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderId,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Request Sent!">
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-success-soft text-success-dark flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <p className="text-[15px] text-text-muted leading-relaxed mb-4">
          Our pharmacy partner will confirm your order on WhatsApp.
        </p>
        {orderId && (
          <div className="bg-bg-soft py-2.5 px-4 rounded-md inline-block mb-6">
            <span className="text-[13px] text-text-muted font-medium">Order ID: </span>
            <strong className="text-[14px] font-bold text-text-primary">
              #{orderId}
            </strong>
          </div>
        )}
        <Button size="l" fullWidth onClick={onClose}>
          Browse More Medicines
        </Button>
      </div>
    </Modal>
  );
};
