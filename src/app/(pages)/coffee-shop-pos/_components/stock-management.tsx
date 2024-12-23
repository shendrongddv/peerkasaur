import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "../_store/use-store";

export default function StockManagement() {
  const { products, updateStock } = useStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <span>{product.name}</span>
              <div className="flex items-center space-x-2">
                <span>Stock: {product.stock}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStock(product.id, -1)}
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStock(product.id, 1)}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
