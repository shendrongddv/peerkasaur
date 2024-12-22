"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

export default function QuoteGenerator({
  initialQuote,
}: {
  initialQuote: Quote;
}) {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewQuote = async (quoteId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/quotes/${quoteId}`);
      const newQuote = await res.json();
      setQuote(newQuote);
    } catch (error) {
      console.error("Failed to fetch new quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a random quote on initial load
  useEffect(() => {
    const randomQuoteId = Math.floor(Math.random() * 1454) + 1; // Random number between 1 and 1454
    fetchNewQuote(randomQuoteId);
  }, []);

  // Fetch a random quote when the refresh button is clicked
  const handleRefresh = () => {
    const randomQuoteId = Math.floor(Math.random() * 1454) + 1;
    fetchNewQuote(randomQuoteId);
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4 text-white">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-balance text-3xl font-bold">
          &ldquo;{quote.quote}&rdquo;
        </p>
        <p className="text-balance text-xl italic">- {quote.author}</p>
      </div>
      <Button
        onClick={handleRefresh}
        disabled={isLoading}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-white text-gray-900 transition-colors duration-200 hover:bg-gray-200"
        aria-label="Fetch new quote"
      >
        <RefreshCw className={`h-6 w-6 ${isLoading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
