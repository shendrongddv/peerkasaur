"use client";

import { useState, useCallback } from "react";
import { ulid } from "ulid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function UlidGenerator() {
  const [count, setCount] = useState<number>(1);
  const [ulids, setUlids] = useState<string[]>([]);

  const generateUlids = useCallback(() => {
    const newUlids = Array.from({ length: count }, () => ulid());
    setUlids(newUlids);
  }, [count]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description: "ULID copied to clipboard",
      });
    });
  }, []);

  const downloadUlids = useCallback(() => {
    const content = ulids.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ulids.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [ulids]);

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">ULID Generator</h1>
      <div className="mb-4 flex items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="count">Number of ULIDs</Label>
          <Input
            id="count"
            type="number"
            min="1"
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, parseInt(e.target.value) || 1))
            }
          />
        </div>
        <Button onClick={generateUlids}>Generate</Button>
      </div>
      {ulids.length > 0 && (
        <>
          <ul className="mb-4 space-y-2">
            {ulids.map((id, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <span className="font-mono">{id}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          <Button onClick={downloadUlids} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download ULIDs
          </Button>
        </>
      )}
    </div>
  );
}
