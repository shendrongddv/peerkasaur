"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { titleCase } from "title-case";

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
  const [fontClass, setFontClass] = useState<string>(""); // State to hold the random font class

  // List of font classes
  const fontClasses = [
    "font-lora",
    "font-merriweather",
    "font-playfairdisplay",
    "font-robotoslab",
    "font-quicksand",
  ];

  // Function to fetch a new quote and set a random font class
  const fetchNewQuote = async (quoteId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/quotes/${quoteId}`);
      const newQuote = await res.json();
      setQuote(newQuote);

      // Set a random font class from the list
      const randomFontClass =
        fontClasses[Math.floor(Math.random() * fontClasses.length)];
      setFontClass(randomFontClass);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch a random quote when the refresh button is clicked
  const handleRefresh = () => {
    const randomQuoteId = Math.floor(Math.random() * 1454) + 1;
    fetchNewQuote(randomQuoteId);
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4 text-white">
      <div className="flex w-full flex-col items-center justify-center text-center lg:w-4/5">
        <p
          className={`mb-4 w-10/12 text-balance text-3xl font-medium lg:text-4xl ${fontClass}`}
        >
          &ldquo;{titleCase(quote.quote.toLowerCase())}&rdquo;
        </p>
        <p className="italic sm:text-xl">- {quote.author}</p>
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
