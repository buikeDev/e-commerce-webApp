import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contextProvider/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Minus, Plus } from "lucide-react";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, total } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
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
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-28 object-cover"
                />
                <CardContent className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground">
                        N{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        value={item.quantity}
                        readOnly
                        className="w-16 text-center"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <div className="pr-4">
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">
                      N{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-end items-center gap-4">
            <div className="text-right">
              <p className="text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">N{total.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button>Checkout</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
