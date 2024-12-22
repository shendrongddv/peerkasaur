"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

export default function QuoteGeneratorBahasa({
  initialQuote,
}: {
  initialQuote: Quote;
}) {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [isLoading, setIsLoading] = useState(false);
  const [translatedQuote, setTranslatedQuote] = useState<string>("");

  const fetchNewQuote = async (quoteId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/quotes/${quoteId}`);
      const newQuote = await res.json();
      setQuote(newQuote);
      translateQuote(newQuote.quote); // Translate after fetching the quote
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

  // Translate quote using LibreTranslate API
  const translateQuote = async (quoteText: string) => {
    try {
      const res = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: quoteText,
          source: "en", // source language is English
          target: "id", // target language is Bahasa Indonesia
        }),
      });
      const data = await res.json();
      setTranslatedQuote(data.translatedText);
    } catch (error) {
      console.error("Failed to translate quote:", error);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    const randomQuoteId = Math.floor(Math.random() * 1454) + 1;
    fetchNewQuote(randomQuoteId);
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4 text-white">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-3xl font-bold">&ldquo;{quote.quote}&rdquo;</p>
        <p className="text-xl italic">- {quote.author}</p>
        {translatedQuote && (
          <p className="mt-4 text-lg italic text-gray-300">
            &ldquo;{translatedQuote}&rdquo;
          </p>
        )}
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
