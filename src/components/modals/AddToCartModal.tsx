import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/contextProvider/CartContext";

interface AddToCartModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  initialQty?: number;
  min?: number;
  max?: number;
  product?: any;
  onSave?: (qty: number) => void;
}

export default function AddToCartModal({
  open,
  onOpenChange,
  initialQty = 1,
  min = 0,
  max = 10000,
  product,
  onSave,
}: AddToCartModalProps) {
  const [qty, setQty] = useState<number>(initialQty);

  useEffect(() => {
    if (open) setQty(initialQty);
  }, [open, initialQty]);
  const { addToCart } = useCart();

  const decrement = () => setQty((q) => Math.max(min, q - 1));
  const increment = () => setQty((q) => Math.min(max, q + 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value || "0", 10);
    if (Number.isNaN(val)) return;
    setQty(Math.max(min, Math.min(max, val)));
  };

  const handleSave = () => {
    const quantity = qty;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
    if (onSave) onSave(quantity);
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quantity</DialogTitle>
          <DialogDescription>
            {product ? `How many ${product.name}?` : "Adjust product quantity."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl justify-center overflow-hidden mt-4">
          <img
            src={product?.image || "/placeholder.png"}
            alt={product?.name || "Product Image"}
            className="w-full h-48 object-cover rounded-md cover"
          />
        </div>

        <div className="flex items-center justify-center gap-3 py-4">
          <Button variant="outline" size="sm" onClick={decrement}>
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            type="number"
            value={qty}
            onChange={handleChange}
            className="w-20 text-center"
          />

          <Button variant="outline" size="sm" onClick={increment}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <DialogFooter className="justify-between flex-row items-center justify-center gap-3">
          <Button onClick={handleSave} className="px-5">
            Save
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" className="px-5">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
