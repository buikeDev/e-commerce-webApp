import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/contextProvider/WishlistContext";
import { useCart } from "@/contextProvider/CartContext";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useState } from "react";
import AddToCartModal from "@/components/modals/AddToCartModal";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<{
    id: number; name: string; price: number; image: string;
  } | null>(null);

  const openModal = (item: typeof wishlistItems[number]) => {
    setModalProduct({ id: item.id, name: item.name, price: item.price, image: item.image });
    setModalOpen(true);
  };

  const moveAllToCart = () => {
    wishlistItems.forEach((item) =>
      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 })
    );
    clearWishlist();
  };

  const discount = (item: typeof wishlistItems[number]) =>
    item.originalPrice
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-1">Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={moveAllToCart}>
                  <ShoppingCart size={15} className="mr-1.5" />
                  Add All to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={clearWishlist}
                >
                  <Trash2 size={15} className="mr-1.5" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Empty state */}
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Heart size={56} className="text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love and come back to them later.
              </p>
              <Button onClick={() => navigate("/AllProducts")}>Browse Products</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => {
                const disc = discount(item);
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary mb-0.5">{item.brand}</p>
                      <h3
                        className="font-semibold text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-primary transition-colors mb-1"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">₦{item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₦{item.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {disc && (
                          <span className="text-xs font-semibold text-destructive">-{disc}%</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" onClick={() => openModal(item)}>
                        <ShoppingCart size={14} className="mr-1.5" />
                        <span className="hidden sm:inline">Add to Cart</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 size={14} className="mr-1.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <AddToCartModal open={modalOpen} onOpenChange={setModalOpen} product={modalProduct} />
      <Footer />
    </div>
  );
};

export default Wishlist;
