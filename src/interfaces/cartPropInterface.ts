export interface cartItemProp {
  id: number;
  name: string;
  price: number;
  image: any;
  quantity: number;
}

export interface cartProp {
  cartItems: cartItemProp[];
  addToCart: (item: cartItemProp) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  total: number;
  clearCart: () => void;
}
