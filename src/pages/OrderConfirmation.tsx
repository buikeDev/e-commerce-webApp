import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, MapPin } from "lucide-react";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.orderId) {
    navigate("/");
    return null;
  }

  const { orderId, shipping, delivery, paymentMethod, items, subtotal, discount, appliedPromo, deliveryCost, orderTotal } = state;

  const PAYMENT_LABELS: Record<string, string> = {
    card: "Credit / Debit Card",
    transfer: "Bank Transfer",
    cod: "Cash on Delivery",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">

          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={52} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-1">
            Thank you, <span className="font-medium text-foreground">{shipping?.firstName}</span>. Your order has been placed.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation will be sent to <span className="font-medium">{shipping?.email}</span>
          </p>

          {/* Order ID */}
          <div className="inline-block bg-primary/10 text-primary font-mono font-bold text-lg px-6 py-3 rounded-xl mb-10">
            Order # {orderId}
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-primary" />
                <p className="font-semibold text-sm">Delivery Address</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {shipping?.address},<br />
                {shipping?.city}, {shipping?.state}<br />
                {shipping?.country}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={16} className="text-primary" />
                <p className="font-semibold text-sm">Delivery Method</p>
              </div>
              <p className="text-sm text-muted-foreground">{delivery?.label}</p>
              <p className="text-xs text-muted-foreground">{delivery?.description}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} className="text-primary" />
                <p className="font-semibold text-sm">Payment</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-card border border-border rounded-xl p-5 text-left mb-6">
            <p className="font-semibold mb-4">Items Ordered</p>
            <div className="space-y-3">
              {items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    ₦{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>₦{subtotal?.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>−₦{discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{deliveryCost === 0 ? "Free" : `₦${deliveryCost?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total Paid</span><span>₦{orderTotal?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate("/AllProducts")}>
              Continue Shopping
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
