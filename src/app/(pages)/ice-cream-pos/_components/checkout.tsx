"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItem {
  id: number;
  name: string;
  title: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  cart: CartItem[];
}

export default function Checkout({ cart }: CheckoutProps) {
  const [amountPaid, setAmountPaid] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const change = Math.max(0, parseFloat(amountPaid) - total);

  const handleExport = () => {
    const invoiceData = `
Ice Cream POS Invoice
---------------------
${cart.map((item) => `${item.title} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

Total: $${total.toFixed(2)}
Amount Paid: $${parseFloat(amountPaid).toFixed(2)}
Change: $${change.toFixed(2)}
    `.trim();

    const blob = new Blob([invoiceData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Checkout</h2>
      <div className="space-y-4">
        <div>
          <p className="font-bold">Total to be paid:</p>
          <p className="text-2xl">${total.toFixed(2)}</p>
        </div>
        <div>
          <label htmlFor="amountPaid" className="mb-1 block">
            Amount paid by customer:
          </label>
          <Input
            type="number"
            id="amountPaid"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            min={0}
            step={0.01}
          />
        </div>
        {amountPaid && (
          <div>
            <p className="font-bold">Change:</p>
            <p className="text-2xl">${change.toFixed(2)}</p>
          </div>
        )}
        <Button
          onClick={handleExport}
          disabled={cart.length === 0 || !amountPaid}
        >
          Process and Export Invoice
        </Button>
      </div>
    </div>
  );
}
