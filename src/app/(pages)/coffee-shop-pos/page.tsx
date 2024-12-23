"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStore } from "./_store/use-store";
import ProductList from "./_components/product-list";
import Cart from "./_components/cart";
import Invoice from "./_components/invoice";
import StockManagement from "./_components/stock-management";
import ReportingHistory from "./_components/reporting-history";
import SalesAnalytics from "./_components/sales-analytics";

export default function CoffeeShopPOS() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { resetLocalStorage } = useStore();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 text-center">
        <p className="text-2xl font-bold">{getGreeting()}</p>
        <p className="text-xl">
          {format(currentTime, "EEEE, MMMM d, yyyy HH:mm:ss")}
        </p>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <ProductList />
        <Cart />
        <Invoice />
      </div>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <StockManagement />
        <ReportingHistory />
        <SalesAnalytics />
      </div>
      <div className="flex justify-center">
        <Button variant="destructive" onClick={resetLocalStorage}>
          <Trash2 className="mr-2 h-4 w-4" /> Reset Local Storage Data
        </Button>
      </div>
    </div>
  );
}
