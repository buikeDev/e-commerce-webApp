import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contextProvider/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Minus, Plus, Tag, X, CheckCircle2, AlertCircle } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems, updateQuantity, removeFromCart, clearCart,
    total, discount, finalTotal, appliedPromo, applyPromo, removePromo,
  } = useCart();

  const [promoInput, setPromoInput] = React.useState("");
  const [promoStatus, setPromoStatus] = React.useState<{ success: boolean; message: string } | null>(null);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const result = applyPromo(promoInput);
    setPromoStatus(result);
    if (result.success) setPromoInput("");
  };

  const handleRemovePromo = () => {
    removePromo();
    setPromoStatus(null);
    setPromoInput("");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
            <Button className="mt-4" onClick={() => navigate("/AllProducts")}>
              Browse Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl mb-6">
            Your Cart
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Items list ─────────────────────────────────────── */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 object-contain rounded-md shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  />

                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors line-clamp-2"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">₦{item.price.toFixed(2)} each</p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border rounded-xl border-primary">
                        <Button
                          variant="ghost"
                          size="custom"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <input
                          min={0}
                          value={item.quantity}
                          className="w-8 text-center border-none bg-transparent text-sm outline-none"
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        />
                        <Button
                          variant="ghost"
                          size="custom"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <p className="font-semibold text-sm">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-start pt-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* ── Order summary ───────────────────────────────────── */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-card border border-border rounded-xl p-5 sticky top-28 space-y-5">
                <h3 className="font-semibold">Order Summary</h3>

                {/* Promo code */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <Tag size={14} /> Promo Code
                  </p>

                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-green-700">{appliedPromo.code}</p>
                        <p className="text-xs text-green-600">{appliedPromo.description}</p>
                      </div>
                      <button onClick={handleRemovePromo} className="text-green-600 hover:text-green-800">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoStatus(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        placeholder="Enter code"
                        className="h-9 text-sm uppercase"
                      />
                      <Button size="sm" variant="outline" onClick={handleApplyPromo}>
                        Apply
                      </Button>
                    </div>
                  )}

                  {/* Feedback message */}
                  {promoStatus && !appliedPromo && (
                    <div className={`flex items-center gap-1.5 mt-2 text-xs ${
                      promoStatus.success ? "text-green-600" : "text-destructive"
                    }`}>
                      {promoStatus.success
                        ? <CheckCircle2 size={12} />
                        : <AlertCircle size={12} />}
                      {promoStatus.message}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₦{total.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>−₦{discount.toFixed(2)}</span>
                    </div>
                  )}

                  {appliedPromo?.type === "shipping" && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                    <span>Total</span>
                    <span>₦{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                  Checkout
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
