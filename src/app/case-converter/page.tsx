"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Copy, Trash2 } from "lucide-react";
import { titleCase } from "title-case";
import { toast } from "@/hooks/use-toast";

type CaseOption =
  | "original"
  | "sentence"
  | "lower"
  | "upper"
  | "capitalized"
  | "alternating"
  | "title"
  | "inverse";

const convertCase = (text: string, caseType: CaseOption): string => {
  switch (caseType) {
    case "original":
      return text;
    case "sentence":
      return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case "lower":
      return text.toLowerCase();
    case "upper":
      return text.toUpperCase();
    case "capitalized":
      return text.replace(/\b\w/g, (c) => c.toUpperCase());
    case "alternating":
      return text
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    case "title":
      return titleCase(text);
    case "inverse":
      return text
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    default:
      return text;
  }
};

export default function TextCaseConverter() {
  const [originalText, setOriginalText] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseOption>("original");

  useEffect(() => {
    setCurrentText((currentText) => convertCase(currentText, selectedCase));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCase, convertCase]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setCurrentText(newText);
    setOriginalText(newText);
    setSelectedCase("original");
  };

  const handleCaseChange = useCallback(
    (value: CaseOption) => {
      setSelectedCase(value);
      setCurrentText((currentText) => {
        return value === "original"
          ? originalText
          : convertCase(currentText, value);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [originalText, convertCase],
  );

  const handleDownload = () => {
    const blob = new Blob([currentText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted_text.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Text has been downloaded as a file.",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    toast({
      title: "Copied!",
      description: "Text has been copied to clipboard.",
    });
  };

  const handleClear = () => {
    setOriginalText("");
    setCurrentText("");
    setSelectedCase("original");
    toast({
      title: "Cleared!",
      description: "Text has been cleared.",
    });
  };

  const getCharCount = () => currentText.length;
  const getWordCount = () =>
    currentText.trim().split(/\s+/).filter(Boolean).length;
  const getSentenceCount = () =>
    currentText.split(/[.!?]+/).filter(Boolean).length;
  const getLineCount = () => currentText.split("\n").filter(Boolean).length;

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Text Case Converter</CardTitle>
        <CardDescription>
          Convert your text to various cases with option to revert to original
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your text here..."
          value={currentText}
          onChange={handleTextChange}
          className="min-h-[200px]"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Characters: {getCharCount()}</span>
          <span>Words: {getWordCount()}</span>
          <span>Sentences: {getSentenceCount()}</span>
          <span>Lines: {getLineCount()}</span>
        </div>
        <RadioGroup
          value={selectedCase}
          onValueChange={handleCaseChange}
          className="flex flex-wrap gap-2"
        >
          {[
            { value: "original", label: "Original Text" },
            { value: "sentence", label: "Sentence case" },
            { value: "lower", label: "lower case" },
            { value: "upper", label: "UPPER CASE" },
            { value: "capitalized", label: "Capitalized Case" },
            { value: "alternating", label: "aLtErNaTiNg cAsE" },
            { value: "title", label: "Title Case" },
            { value: "inverse", label: "InVeRsE CaSe" },
          ].map((option) => (
            <div key={option.value}>
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="sr-only"
              />
              <Label
                htmlFor={option.value}
                className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  selectedCase === option.value
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button onClick={handleClear} variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}
