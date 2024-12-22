"use client";

import { useState, useEffect } from "react";
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
import _ from "lodash";
import { toast } from "@/hooks/use-toast";

type CaseOption =
  | "sentence"
  | "lower"
  | "upper"
  | "capitalized"
  | "alternating"
  | "title"
  | "inverse";

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseOption>("sentence");

  const convertCase = (text: string, caseType: CaseOption): string => {
    switch (caseType) {
      case "sentence":
        return _.capitalize(text.toLowerCase());
      case "lower":
        return _.toLower(text);
      case "upper":
        return _.toUpper(text);
      case "capitalized":
        return _.startCase(_.toLower(text));
      case "alternating":
        return text
          .split("")
          .map((c, i) => (i % 2 === 0 ? _.toLower(c) : _.toUpper(c)))
          .join("");
      case "title":
        return _.startCase(text);
      case "inverse":
        return text
          .split("")
          .map((c) =>
            _.isEqual(c, _.toUpper(c)) ? _.toLower(c) : _.toUpper(c),
          )
          .join("");
      default:
        return text;
    }
  };

  useEffect(() => {
    setText(convertCase(text, selectedCase));
  }, [selectedCase, text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSelectedCase("sentence"); // Reset to sentence case when text changes
  };

  const handleCaseChange = (value: CaseOption) => {
    setSelectedCase(value);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
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
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text has been copied to clipboard.",
    });
  };

  const handleClear = () => {
    setText("");
    setSelectedCase("sentence");
    toast({
      title: "Cleared!",
      description: "Text has been cleared.",
    });
  };

  const getCharCount = () => text.length;
  const getWordCount = () => _.words(text).length;
  const getSentenceCount = () =>
    _.split(text, /[.!?]+/).filter(_.identity).length;
  const getLineCount = () => _.split(text, "\n").filter(_.identity).length;

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Text Case Converter (Lodash)</CardTitle>
        <CardDescription>
          Convert your text to various cases using Lodash
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your text here..."
          value={text}
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
          onValueChange={(value) => handleCaseChange(value as CaseOption)}
          className="flex flex-wrap gap-2"
        >
          {[
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
