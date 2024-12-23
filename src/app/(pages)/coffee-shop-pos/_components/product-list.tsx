import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "../_store/use-store";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ProductList() {
  const { products, addToCart } = useStore();

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.desc}</p>
              <p className="mt-2">
                Harga Jual: {formatCurrency.format(product.hargaJual)}
              </p>
              <p className="mt-1">Stock: {product.stock}</p>
              <Button
                className="mt-2 w-full"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
