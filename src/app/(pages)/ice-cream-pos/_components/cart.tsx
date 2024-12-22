import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: number, change: number) => void;
}

export default function Cart({ cart, updateQuantity }: CartProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li
              key={item.id}
              className="mb-2 flex items-center justify-between"
            >
              <span>{item.title}</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
