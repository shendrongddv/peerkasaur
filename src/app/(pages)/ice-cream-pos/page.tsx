"use client";

import { useState } from "react";
import ProductList from "./_components/product-list";
import Cart from "./_components/cart";
import Checkout from "./_components/checkout";

interface Product {
  id: number;
  name: string;
  title: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "vanilla", title: "Vanilla Delight", price: 3.99 },
  { id: 2, name: "chocolate", title: "Chocolate Dream", price: 4.49 },
  { id: 3, name: "strawberry", title: "Strawberry Bliss", price: 4.29 },
  { id: 4, name: "mint", title: "Mint Chip Madness", price: 4.79 },
  { id: 5, name: "cookie", title: "Cookie Dough Craze", price: 4.99 },
  { id: 6, name: "mango", title: "Mango Tango", price: 4.59 },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Ice Cream POS</h1>
      <div className="grid grid-cols-1 gap-6">
        <ProductList products={products} addToCart={addToCart} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Cart cart={cart} updateQuantity={updateQuantity} />
          <Checkout cart={cart} />
        </div>
      </div>
    </main>
  );
}
