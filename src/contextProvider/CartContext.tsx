import { createContext, useContext, useState } from "react";
import { cartProp, cartItemProp } from "@/interfaces/cartPropInterface";

const cartContext = createContext<cartProp | undefined>(undefined);

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<cartItemProp[]>([]);

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
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
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
