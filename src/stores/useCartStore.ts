import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Medicine } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (medicine: Medicine) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, delta: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: (isPremium: boolean) => number;
  getDeliveryFee: () => number;
  getTotal: (isPremium: boolean) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (medicine: Medicine) => {
        set((state) => {
          const existing = state.items.find((item) => item.medicineId === medicine.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.medicineId === medicine.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                medicineId: medicine.id,
                name: medicine.name,
                price: medicine.price,
                quantity: 1,
                image: medicine.image,
                requiresRx: medicine.requiresRx,
              },
            ],
          };
        });
      },

      removeItem: (medicineId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.medicineId !== medicineId),
        }));
      },

      updateQuantity: (medicineId: string, delta: number) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.medicineId === medicineId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { items: updated };
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscount: (isPremium: boolean) => {
        if (!isPremium) return 0;
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.2); // 20% discount
      },

      getDeliveryFee: () => {
        return get().items.length > 0 ? 30 : 0;
      },

      getTotal: (isPremium: boolean) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount(isPremium);
        const delivery = get().getDeliveryFee();
        return Math.max(0, subtotal - discount + delivery);
      },
    }),
    {
      name: "medilink_cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
