import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contextProvider/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronRight, Truck, Zap, Clock, CreditCard, Banknote, Wallet } from "lucide-react";

// ─── Zod schema ────────────────────────────────────────────────────────────────
const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName:  z.string().min(1, "Last name is required"),
  email:     z.string().email("Enter a valid email"),
  phone:     z.string().min(7, "Enter a valid phone number"),
  address:   z.string().min(5, "Enter a full street address"),
  city:      z.string().min(1, "City is required"),
  state:     z.string().min(1, "State is required"),
  zipCode:   z.string().min(3, "Enter a valid zip / postal code"),
  country:   z.string().min(1, "Country is required"),
});
type ShippingData = z.infer<typeof shippingSchema>;

const cardSchema = z.object({
  cardName:   z.string().min(2, "Name on card is required"),
  cardNumber: z
    .string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Enter a valid 16-digit card number"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "Enter 3 or 4 digit CVV"),
});
type CardData = z.infer<typeof cardSchema>;

// ─── Delivery options ───────────────────────────────────────────────────────────
const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "5–7 business days",
    price: 0,
    icon: Truck,
  },
  {
    id: "express",
    label: "Express Delivery",
    description: "2–3 business days",
    price: 2000,
    icon: Zap,
  },
  {
    id: "overnight",
    label: "Overnight Delivery",
    description: "Next business day",
    price: 5000,
    icon: Clock,
  },
];

// ─── Payment methods ────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: "card",     label: "Credit / Debit Card",  icon: CreditCard },
  { id: "transfer", label: "Bank Transfer",         icon: Banknote },
  { id: "cod",      label: "Cash on Delivery",      icon: Wallet },
];

// ─── Step indicator ─────────────────────────────────────────────────────────────
const STEPS = ["Shipping", "Delivery", "Payment", "Review"];

const StepBar = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center mb-10 gap-0">
    {STEPS.map((label, i) => {
      const done    = i < current;
      const active  = i === current;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : active
                  ? "border-primary text-primary"
                  : "border-muted text-muted-foreground"
              }`}
            >
              {done ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-12 sm:w-20 mx-1 mb-4 transition-colors ${
                i < current ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Main component ─────────────────────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, total, discount, finalTotal, appliedPromo, clearCart, removePromo } = useCart();

  const [step, setStep] = React.useState(0);
  const [deliveryOption, setDeliveryOption] = React.useState("standard");
  const [paymentMethod, setPaymentMethod] = React.useState("card");
  const [shippingData, setShippingData] = React.useState<ShippingData | null>(null);

  const baseDeliveryCost = DELIVERY_OPTIONS.find((o) => o.id === deliveryOption)?.price ?? 0;
  const deliveryCost = appliedPromo?.type === "shipping" ? 0 : baseDeliveryCost;
  const orderTotal = finalTotal + deliveryCost;

  // Redirect empty cart
  React.useEffect(() => {
    if (cartItems.length === 0) navigate("/cart");
  }, [cartItems, navigate]);

  // ── Step 1: Shipping form ──────────────────────────────────────────────────
  const {
    register: regShipping,
    handleSubmit: handleShipping,
    formState: { errors: shippingErrors },
  } = useForm<ShippingData>({ resolver: zodResolver(shippingSchema) });

  const onShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setStep(1);
  };

  // ── Step 3: Card form ──────────────────────────────────────────────────────
  const {
    register: regCard,
    handleSubmit: handleCard,
    formState: { errors: cardErrors },
  } = useForm<CardData>({ resolver: zodResolver(cardSchema) });

  const onCardSubmit = () => setStep(3);

  // ── Place order ────────────────────────────────────────────────────────────
  const placeOrder = () => {
    const orderId = `EH-${Date.now().toString(36).toUpperCase()}`;
    clearCart();
    removePromo();
    navigate("/order-confirmation", {
      state: {
        orderId,
        shipping: shippingData,
        delivery: DELIVERY_OPTIONS.find((o) => o.id === deliveryOption),
        paymentMethod,
        items: cartItems,
        subtotal: total,
        discount,
        appliedPromo,
        deliveryCost,
        orderTotal,
      },
    });
  };

  // ── Field helper ───────────────────────────────────────────────────────────
  const Field = ({
    label, error, children,
  }: { label: string; error?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  // ── Order summary sidebar ──────────────────────────────────────────────────
  const OrderSummary = () => (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="bg-card border border-border rounded-xl p-5 sticky top-28">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
          {cartItems.map((item) => (
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
              <span className="text-sm font-semibold shrink-0">
                ₦{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 space-y-2 text-sm">
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
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span>
              {deliveryCost === 0
                ? <span className={appliedPromo?.type === "shipping" ? "text-green-600 font-medium" : ""}>Free</span>
                : `₦${deliveryCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-border pt-2">
            <span>Total</span>
            <span>₦{orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
          <StepBar current={step} />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Main panel ─────────────────────────────────────── */}
            <div className="flex-1">

              {/* STEP 0: Shipping address */}
              {step === 0 && (
                <form onSubmit={handleShipping(onShippingSubmit)} className="bg-card border border-border rounded-xl p-6 space-y-5">
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First Name" error={shippingErrors.firstName?.message}>
                      <Input {...regShipping("firstName")} placeholder="John" />
                    </Field>
                    <Field label="Last Name" error={shippingErrors.lastName?.message}>
                      <Input {...regShipping("lastName")} placeholder="Doe" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Email Address" error={shippingErrors.email?.message}>
                      <Input {...regShipping("email")} type="email" placeholder="john@example.com" />
                    </Field>
                    <Field label="Phone Number" error={shippingErrors.phone?.message}>
                      <Input {...regShipping("phone")} type="tel" placeholder="+234 800 000 0000" />
                    </Field>
                  </div>
                  <Field label="Street Address" error={shippingErrors.address?.message}>
                    <Input {...regShipping("address")} placeholder="12 Broad Street, Apt 4B" />
                  </Field>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Field label="City" error={shippingErrors.city?.message}>
                      <Input {...regShipping("city")} placeholder="Lagos" />
                    </Field>
                    <Field label="State" error={shippingErrors.state?.message}>
                      <Input {...regShipping("state")} placeholder="Lagos State" />
                    </Field>
                    <Field label="Zip / Postal Code" error={shippingErrors.zipCode?.message}>
                      <Input {...regShipping("zipCode")} placeholder="100001" />
                    </Field>
                    <Field label="Country" error={shippingErrors.country?.message}>
                      <Input {...regShipping("country")} placeholder="Nigeria" />
                    </Field>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">
                      Continue <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </form>
              )}

              {/* STEP 1: Delivery method */}
              {step === 1 && (
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Delivery Method</h2>
                  <div className="space-y-3">
                    {DELIVERY_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            deliveryOption === opt.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value={opt.id}
                            checked={deliveryOption === opt.id}
                            onChange={() => setDeliveryOption(opt.id)}
                            className="sr-only"
                          />
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                            deliveryOption === opt.id ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{opt.label}</p>
                            <p className="text-sm text-muted-foreground">{opt.description}</p>
                          </div>
                          <span className="font-semibold">
                            {opt.price === 0 ? "Free" : `₦${opt.price.toLocaleString()}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                    <Button onClick={() => setStep(2)}>
                      Continue <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Payment */}
              {step === 2 && (
                <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                  <h2 className="text-lg font-semibold">Payment Method</h2>

                  {/* Method selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                            paymentMethod === m.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <Icon size={24} className={paymentMethod === m.id ? "text-primary" : "text-muted-foreground"} />
                          <span className="text-sm font-medium text-center">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Card form */}
                  {paymentMethod === "card" && (
                    <form onSubmit={handleCard(onCardSubmit)} className="space-y-4 pt-2">
                      <Field label="Name on Card" error={cardErrors.cardName?.message}>
                        <Input {...regCard("cardName")} placeholder="John Doe" />
                      </Field>
                      <Field label="Card Number" error={cardErrors.cardNumber?.message}>
                        <Input
                          {...regCard("cardNumber")}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Expiry (MM/YY)" error={cardErrors.expiry?.message}>
                          <Input {...regCard("expiry")} placeholder="09/27" maxLength={5} />
                        </Field>
                        <Field label="CVV" error={cardErrors.cvv?.message}>
                          <Input {...regCard("cvv")} placeholder="123" maxLength={4} type="password" />
                        </Field>
                      </div>
                      <div className="flex justify-between pt-2">
                        <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                        <Button type="submit">
                          Continue <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Bank transfer */}
                  {paymentMethod === "transfer" && (
                    <div className="space-y-4 pt-2">
                      <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
                        <p className="font-medium">Bank Transfer Details</p>
                        <p className="text-muted-foreground">Bank: First Bank of Nigeria</p>
                        <p className="text-muted-foreground">Account Name: ElectroHub Ltd</p>
                        <p className="text-muted-foreground">Account Number: 3012345678</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Use your order ID as the payment reference. Your order will be confirmed after payment verification.
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={() => setStep(3)}>
                          Continue <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Cash on delivery */}
                  {paymentMethod === "cod" && (
                    <div className="space-y-4 pt-2">
                      <div className="bg-muted rounded-xl p-4 text-sm text-muted-foreground">
                        Pay with cash when your order is delivered. Please have the exact amount ready.
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={() => setStep(3)}>
                          Continue <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Review */}
              {step === 3 && (
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                  <h2 className="text-lg font-semibold">Review Your Order</h2>

                  {/* Shipping summary */}
                  <div className="rounded-lg border border-border p-4 space-y-1 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Shipping Address</p>
                      <button className="text-xs text-primary hover:underline" onClick={() => setStep(0)}>Edit</button>
                    </div>
                    {shippingData && (
                      <p className="text-muted-foreground">
                        {shippingData.firstName} {shippingData.lastName} · {shippingData.phone}<br />
                        {shippingData.address}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}, {shippingData.country}
                      </p>
                    )}
                  </div>

                  {/* Delivery + payment summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Delivery</p>
                        <button className="text-xs text-primary hover:underline" onClick={() => setStep(1)}>Edit</button>
                      </div>
                      <p className="text-muted-foreground">
                        {DELIVERY_OPTIONS.find((o) => o.id === deliveryOption)?.label}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Payment</p>
                        <button className="text-xs text-primary hover:underline" onClick={() => setStep(2)}>Edit</button>
                      </div>
                      <p className="text-muted-foreground">
                        {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="font-medium mb-3 text-sm">
                      Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                    </p>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-muted shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₦{item.price.toFixed(2)}</p>
                          </div>
                          <span className="text-sm font-semibold">₦{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-border pt-4 space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span><span>₦{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span>{deliveryCost === 0 ? "Free" : `₦${deliveryCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-1">
                      <span>Total</span><span>₦{orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button size="lg" onClick={placeOrder}>
                      Place Order
                    </Button>
                  </div>
                </div>
              )}

            </div>

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <OrderSummary />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
