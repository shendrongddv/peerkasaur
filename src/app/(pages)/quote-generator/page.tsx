import QuoteGenerator from "./_components/quote-generator";

export default async function QuotePage() {
  const res = await fetch("https://dummyjson.com/quotes/1");
  const initialQuote = await res.json();

  return <QuoteGenerator initialQuote={initialQuote} />;
}
