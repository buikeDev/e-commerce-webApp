import { createContext, useContext, useEffect, useState } from "react";
import { Review, SEED_REVIEWS } from "@/mockData/mockReviews";

interface ReviewsContextType {
  getReviews: (productId: number) => Review[];
  addReview: (review: Omit<Review, "id" | "date" | "verified">) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const raw = localStorage.getItem("reviews");
      return raw ? (JSON.parse(raw) as Review[]) : SEED_REVIEWS;
    } catch {
      return SEED_REVIEWS;
    }
  });

  useEffect(() => {
    try { localStorage.setItem("reviews", JSON.stringify(reviews)); } catch {}
  }, [reviews]);

  const getReviews = (productId: number) =>
    reviews.filter((r) => r.productId === productId);

  const addReview = (review: Omit<Review, "id" | "date" | "verified">) => {
    const newReview: Review = {
      ...review,
      id: `r${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      verified: false,
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <ReviewsContext.Provider value={{ getReviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsContextProvider");
  return ctx;
};
