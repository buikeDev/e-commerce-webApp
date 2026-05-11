export type PromoType = "percent" | "fixed" | "shipping";

export interface PromoCode {
  code: string;
  type: PromoType;
  value: number;
  description: string;
}

export const PROMO_CODES: PromoCode[] = [
  { code: "ELECTRO10", type: "percent",  value: 10,   description: "10% off your order" },
  { code: "SAVE500",   type: "fixed",    value: 500,  description: "₦500 off your order" },
  { code: "NEWUSER20", type: "percent",  value: 20,   description: "20% off for new users" },
  { code: "BUNDLE15",  type: "percent",  value: 15,   description: "15% off bundle orders" },
  { code: "FREESHIP",  type: "shipping", value: 0,    description: "Free shipping on this order" },
];

export const findPromo = (code: string): PromoCode | null =>
  PROMO_CODES.find((p) => p.code === code.toUpperCase().trim()) ?? null;

export const computeDiscount = (promo: PromoCode, subtotal: number): number => {
  if (promo.type === "percent")  return (subtotal * promo.value) / 100;
  if (promo.type === "fixed")    return Math.min(promo.value, subtotal);
  return 0;
};
