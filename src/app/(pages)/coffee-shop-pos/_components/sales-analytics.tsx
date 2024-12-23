import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "../_store/use-store";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function SalesAnalytics() {
  const { purchaseHistory } = useStore();

  const totalItemsSold = purchaseHistory.reduce(
    (total, record) =>
      total + record.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );

  const totalRevenue = purchaseHistory.reduce(
    (total, record) => total + record.total,
    0,
  );

  const totalProfit = purchaseHistory.reduce(
    (total, record) =>
      total +
      record.items.reduce(
        (sum, item) => sum + (item.hargaJual - item.hargaPokok) * item.quantity,
        0,
      ),
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Total Items Sold: {totalItemsSold}</p>
          <p>Total Revenue: {formatCurrency.format(totalRevenue)}</p>
          <p>Total Profit: {formatCurrency.format(totalProfit)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
