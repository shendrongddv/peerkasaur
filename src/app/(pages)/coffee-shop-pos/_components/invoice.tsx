"use client";

import { useState } from "react";
import { ulid } from "ulid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { useStore } from "../_store/use-store";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Invoice() {
  const { cart, resetCart, addPurchaseRecord } = useStore();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.hargaJual * item.quantity,
    0,
  );

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      const purchaseRecord = {
        id: ulid(),
        date: new Date().toISOString(),
        items: cart,
        total: total,
      };
      addPurchaseRecord(purchaseRecord);

      const invoiceContent = `
Coffee Shop Invoice
-------------------
${cart.map((item) => `${item.name} x${item.quantity}: ${formatCurrency.format(item.hargaJual * item.quantity)}`).join("\n")}
-------------------
Total: ${formatCurrency.format(total)}
Payment Method: ${paymentMethod.toUpperCase()}
${
  paymentMethod === "cash"
    ? `Cash Received: ${formatCurrency.format(parseFloat(cashAmount))}
Change: ${formatCurrency.format(parseFloat(cashAmount) - total)}`
    : ""
}
Thank you for your purchase!
      `;
      const blob = new Blob([invoiceContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.txt";
      a.click();
      URL.revokeObjectURL(url);
      setIsProcessing(false);
      resetCart();
      setCashAmount("");
      setPaymentMethod("cash");
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p>
            Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
          <p>Total Amount: {formatCurrency.format(total)}</p>
        </div>
        <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="qris">QRIS</TabsTrigger>
          </TabsList>
          <TabsContent value="cash">
            <Input
              type="number"
              placeholder="Enter cash amount"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="mb-4"
            />
            <p>
              Change:{" "}
              {formatCurrency.format(
                Math.max(0, parseFloat(cashAmount) - total),
              )}
            </p>
          </TabsContent>
          <TabsContent value="qris">
            <div className="mb-4 flex justify-center">
              <QRCodeSVG value={`https://example.com/pay/${total}`} />
            </div>
          </TabsContent>
        </Tabs>
        <Button
          className="mt-4 w-full"
          onClick={handleProcess}
          disabled={
            isProcessing ||
            (paymentMethod === "cash" && parseFloat(cashAmount) < total)
          }
        >
          {isProcessing ? "Processing..." : "Process Payment"}
        </Button>
      </CardContent>
    </Card>
  );
}
