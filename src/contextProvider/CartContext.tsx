import { createContext, useContext, useEffect, useState } from "react";
import { cartProp, cartItemProp } from "@/interfaces/cartPropInterface";
import { PromoCode, findPromo, computeDiscount } from "@/mockData/promoCodes";

interface CartContextType extends cartProp {
  appliedPromo: PromoCode | null;
  discount: number;
  finalTotal: number;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
}

const cartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<cartItemProp[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? (JSON.parse(raw) as cartItemProp[]) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(() => {
    try {
      const raw = localStorage.getItem("promo");
      return raw ? (JSON.parse(raw) as PromoCode) : null;
    } catch {
      return null;
    }
  });

  const addToCart = (item: cartItemProp) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: number) =>
    setCart((prev) => prev.filter((c) => c.id !== itemId));

  const updateQuantity = (itemId: number, quantity: number) => {
    let q = Number.isNaN(quantity) ? 0 : quantity;
    if (q < 0) q = 1;
    setCart((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, quantity: q } : c))
    );
  };

  const clearCart = () => setCart([]);

  const applyPromo = (code: string): { success: boolean; message: string } => {
    const promo = findPromo(code);
    if (!promo) return { success: false, message: "Invalid promo code." };
    setAppliedPromo(promo);
    return { success: true, message: `"${promo.code}" applied — ${promo.description}` };
  };

  const removePromo = () => setAppliedPromo(null);

  const total    = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo ? computeDiscount(appliedPromo, total) : 0;
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    try { localStorage.setItem("cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedPromo) localStorage.setItem("promo", JSON.stringify(appliedPromo));
      else localStorage.removeItem("promo");
    } catch {}
  }, [appliedPromo]);

  return (
    <cartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        updateQuantity,
        appliedPromo,
        discount,
        finalTotal,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(cartContext);
  if (!context) throw new Error("useCart must be used within a CartContextProvider");
  return context;
};
