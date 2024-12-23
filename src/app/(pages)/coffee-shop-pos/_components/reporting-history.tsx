import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "../_store/use-store";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ReportingHistory() {
  const { purchaseHistory } = useStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchaseHistory.map((record) => (
            <div key={record.id} className="border-b pb-2">
              <p className="font-semibold">
                {new Date(record.date).toLocaleString()}
              </p>
              <p>Total: {formatCurrency.format(record.total)}</p>
              <ul className="list-inside list-disc">
                {record.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x{item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
