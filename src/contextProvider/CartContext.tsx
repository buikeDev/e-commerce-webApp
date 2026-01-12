import { createContext, useContext, useEffect, useState } from "react";
import { cartProp, cartItemProp } from "@/interfaces/cartPropInterface";

const cartContext = createContext<cartProp | undefined>(undefined);

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<cartItemProp[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? (JSON.parse(raw) as cartItemProp[]) : [];
    } catch (e) {
      return [];
    }
  });

  const addToCart = (item: cartItemProp) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      );
    } else {
      setCart([...cart, item]);
    }
  };
  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((cartItem) => cartItem.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (Number.isNaN(quantity)) {
      quantity = 0;
    }

    if (quantity < 0) {
      quantity = 1;
    }

    setCart(
      cart.map((cartItem) =>
        cartItem.id === itemId ? { ...cartItem, quantity } : cartItem
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      // ignore storage errors
      console.error(e);
    }
  }, [cart]);

  return (
    <cartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        updateQuantity,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
