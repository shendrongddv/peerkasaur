import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "../_store/use-store";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Cart() {
  const { cart, updateQuantity } = useStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart ({totalItems} items)</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.map((item) => (
          <div key={item.id} className="mb-2 flex items-center justify-between">
            <span>{item.name}</span>
            <div className="flex items-center">
              <span className="mr-2">
                {formatCurrency.format(item.hargaJual)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, -1)}
              >
                -
              </Button>
              <span className="mx-2">{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, 1)}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
