"use client";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Download, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

type UuidVersion = "4";
type UuidFormat = "default" | "noDashes" | "uppercase";

const formatUuid = (uuid: string, format: UuidFormat): string => {
  switch (format) {
    case "noDashes":
      return uuid.replace(/-/g, "");
    case "uppercase":
      return uuid.toUpperCase();
    default:
      return uuid;
  }
};

export default function UuidGenerator() {
  const [count, setCount] = useState<number>(1);
  const [version, setVersion] = useState<UuidVersion>("4");
  const [format, setFormat] = useState<UuidFormat>("default");
  const [includeTimestamp, setIncludeTimestamp] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);

  // Load state from localStorage in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCount = localStorage.getItem("uuidCount");
      const savedVersion = localStorage.getItem("uuidVersion");
      const savedFormat = localStorage.getItem("uuidFormat");
      const savedIncludeTimestamp = localStorage.getItem("includeTimestamp");

      setCount(savedCount ? parseInt(savedCount) : 1);
      setVersion((savedVersion as UuidVersion) || "4");
      setFormat((savedFormat as UuidFormat) || "default");
      setIncludeTimestamp(
        savedIncludeTimestamp ? JSON.parse(savedIncludeTimestamp) : false,
      );
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("uuidCount", count.toString());
      localStorage.setItem("uuidVersion", version);
      localStorage.setItem("uuidFormat", format);
      localStorage.setItem(
        "includeTimestamp",
        JSON.stringify(includeTimestamp),
      );
    }
  }, [count, version, format, includeTimestamp]);

  const generateUuids = useCallback(() => {
    try {
      const newUuids = Array.from({ length: count }, () => {
        const uuid = formatUuid(uuidv4(), format);
        return includeTimestamp
          ? `${new Date().toISOString()} - ${uuid}`
          : uuid;
      });
      setUuids(newUuids);
    } catch (error) {
      console.error("Error generating UUIDs:", error);
      toast({
        variant: "destructive",
        description:
          "An error occurred while generating UUIDs. Please try again.",
      });
    }
  }, [count, format, includeTimestamp]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          description: "UUID copied to clipboard",
        });
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast({
          variant: "destructive",
          description: "Failed to copy to clipboard. Please try again.",
        });
      });
  }, []);

  const copyAllToClipboard = useCallback(() => {
    const allUuids = uuids.join("\n");
    navigator.clipboard
      .writeText(allUuids)
      .then(() => {
        toast({
          description: "All UUIDs copied to clipboard",
        });
      })
      .catch((error) => {
        console.error("Error copying all UUIDs to clipboard:", error);
        toast({
          variant: "destructive",
          description: "Failed to copy all UUIDs. Please try again.",
        });
      });
  }, [uuids]);

  const downloadUuids = useCallback(() => {
    try {
      const content = uuids.join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "uuids.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading UUIDs:", error);
      toast({
        variant: "destructive",
        description:
          "An error occurred while downloading UUIDs. Please try again.",
      });
    }
  }, [uuids]);

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">UUID Generator</h1>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="count">Number of UUIDs</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) =>
              setCount(
                Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)),
              )
            }
          />
        </div>
        <div>
          <Label htmlFor="version">UUID Version</Label>
          <Select
            value={version}
            onValueChange={(value: UuidVersion) => setVersion(value)}
          >
            <SelectTrigger id="version">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">Version 4 (Random)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="format">UUID Format</Label>
          <Select
            value={format}
            onValueChange={(value: UuidFormat) => setFormat(value)}
          >
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="noDashes">No Dashes</SelectItem>
              <SelectItem value="uppercase">Uppercase</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="timestamp"
            checked={includeTimestamp}
            onCheckedChange={setIncludeTimestamp}
          />
          <Label htmlFor="timestamp">Include Timestamp</Label>
        </div>
      </div>
      <Button onClick={generateUuids} className="mb-4 w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        Generate
      </Button>
      {uuids.length > 0 && (
        <>
          <ul className="mb-4 max-h-96 space-y-2 overflow-y-auto">
            {uuids.map((id, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <span className="break-all font-mono text-sm">{id}</span>
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
          <div className="mb-4 flex gap-2">
            <Button onClick={copyAllToClipboard} className="flex-1">
              <Copy className="mr-2 h-4 w-4" /> Copy All
            </Button>
            <Button onClick={downloadUuids} className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Download UUIDs
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
