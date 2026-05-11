import { createContext, useContext, useEffect, useState } from "react";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  brand: string;
  rating: number;
  category: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const addToWishlist = (item: WishlistItem) => {
    setItems((prev) => (prev.find((i) => i.id === item.id) ? prev : [...prev, item]));
  };

  const removeFromWishlist = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: number) => items.some((i) => i.id === id);

  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ wishlistItems: items, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistContextProvider");
  return ctx;
};
