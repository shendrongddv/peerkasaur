"use client";

import { useState, useCallback, useEffect } from "react";
import cuid from "cuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Download, RefreshCw, QrCode } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";

type CuidVersion = "cuid" | "cuid2";
type CuidFormat = "default" | "short" | "custom";

const createId = ({
  length,
  fingerprint,
}: {
  length?: number;
  fingerprint?: string;
}) => {
  // Generate a CUID2 (or custom CUID logic) with optional fingerprint and length
  const baseId = fingerprint
    ? `${fingerprint}-${Math.random().toString(36).substr(2)}`
    : Math.random().toString(36).substr(2);
  return length ? baseId.slice(0, length) : baseId;
};

const generateCuid = (
  version: CuidVersion,
  format: CuidFormat,
  customLength?: number,
  fingerprint?: string,
): string => {
  if (version === "cuid") {
    const id = cuid();
    if (format === "short") return id.slice(0, 8);
    return id;
  } else {
    if (format === "short") return createId({ length: 8, fingerprint });
    if (format === "custom" && customLength)
      return createId({ length: customLength, fingerprint });
    return createId({ fingerprint });
  }
};

const extractTimestamp = (id: string, version: CuidVersion): string => {
  if (version === "cuid") {
    const timestamp = parseInt(id.slice(0, 8), 36);
    return new Date(timestamp).toISOString();
  } else {
    // CUID2 doesn't have an easily extractable timestamp
    return "N/A for CUID2";
  }
};

const generateSlug = (id: string): string => {
  return id
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

export default function CuidGenerator() {
  const [count, setCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cuidCount");
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });
  const [cuids, setCuids] = useState<string[]>([]);
  const [version, setVersion] = useState<CuidVersion>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cuidVersion");
      return (saved as CuidVersion) || "cuid2";
    }
    return "cuid2";
  });
  const [format, setFormat] = useState<CuidFormat>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cuidFormat");
      return (saved as CuidFormat) || "default";
    }
    return "default";
  });
  const [customLength, setCustomLength] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cuidCustomLength");
      return saved ? parseInt(saved) : 24;
    }
    return 24;
  });
  const [includeTimestamp, setIncludeTimestamp] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("includeTimestamp");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [includeSlug, setIncludeSlug] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("includeSlug");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [fingerprint, setFingerprint] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cuidFingerprint");
      return saved || "";
    }
    return "";
  });
  const [selectedCuid, setSelectedCuid] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("cuidCount", count.toString());
    localStorage.setItem("cuidVersion", version);
    localStorage.setItem("cuidFormat", format);
    localStorage.setItem("cuidCustomLength", customLength.toString());
    localStorage.setItem("includeTimestamp", JSON.stringify(includeTimestamp));
    localStorage.setItem("includeSlug", JSON.stringify(includeSlug));
    localStorage.setItem("cuidFingerprint", fingerprint);
  }, [
    count,
    version,
    format,
    customLength,
    includeTimestamp,
    includeSlug,
    fingerprint,
  ]);

  const generateCuids = useCallback(() => {
    try {
      const startTime = performance.now();
      const newCuids = Array.from({ length: count }, () => {
        const id = generateCuid(version, format, customLength, fingerprint);
        const timestamp = includeTimestamp ? extractTimestamp(id, version) : "";
        const slug = includeSlug ? generateSlug(id) : "";
        return { id, timestamp, slug };
      });
      const endTime = performance.now();
      setCuids(
        newCuids.map(
          ({ id, timestamp, slug }) =>
            `${id}${timestamp ? ` - ${timestamp}` : ""}${slug ? ` - ${slug}` : ""}`,
        ),
      );
      toast({
        description: `Generated ${count} CUIDs in ${(endTime - startTime).toFixed(2)}ms`,
      });
    } catch (error) {
      console.error("Error generating CUIDs:", error);
      toast({
        variant: "destructive",
        description:
          "An error occurred while generating CUIDs. Please try again.",
      });
    }
  }, [
    count,
    version,
    format,
    customLength,
    includeTimestamp,
    includeSlug,
    fingerprint,
  ]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          description: "CUID copied to clipboard",
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
    const allCuids = cuids.join("\n");
    navigator.clipboard
      .writeText(allCuids)
      .then(() => {
        toast({
          description: "All CUIDs copied to clipboard",
        });
      })
      .catch((error) => {
        console.error("Error copying all CUIDs to clipboard:", error);
        toast({
          variant: "destructive",
          description: "Failed to copy all CUIDs. Please try again.",
        });
      });
  }, [cuids]);

  const downloadCuids = useCallback(() => {
    try {
      const content = cuids.join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "cuids.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CUIDs:", error);
      toast({
        variant: "destructive",
        description:
          "An error occurred while downloading CUIDs. Please try again.",
      });
    }
  }, [cuids]);

  const copyAsFormat = useCallback((cuid: string, format: "js" | "sql") => {
    let formattedText = "";
    if (format === "js") {
      formattedText = `const id = '${cuid}';`;
    } else if (format === "sql") {
      formattedText = `INSERT INTO table_name (id_column) VALUES ('${cuid}');`;
    }
    navigator.clipboard
      .writeText(formattedText)
      .then(() => {
        toast({
          description: `CUID copied as ${format.toUpperCase()} format`,
        });
      })
      .catch((error) => {
        console.error("Error copying formatted CUID:", error);
        toast({
          variant: "destructive",
          description: "Failed to copy formatted CUID. Please try again.",
        });
      });
  }, []);

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">CUID Generator</h1>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="count">Number of CUIDs</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="10000"
            value={count}
            onChange={(e) =>
              setCount(
                Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)),
              )
            }
          />
        </div>
        <div>
          <Label htmlFor="version">CUID Version</Label>
          <Select
            value={version}
            onValueChange={(value: CuidVersion) => setVersion(value)}
          >
            <SelectTrigger id="version">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cuid">CUID</SelectItem>
              <SelectItem value="cuid2">CUID2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="format">CUID Format</Label>
          <Select
            value={format}
            onValueChange={(value: CuidFormat) => setFormat(value)}
          >
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="short">Short (8 characters)</SelectItem>
              <SelectItem value="custom">Custom Length</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {format === "custom" && (
          <div>
            <Label htmlFor="customLength">Custom Length</Label>
            <Input
              id="customLength"
              type="number"
              min="1"
              max="128"
              value={customLength}
              onChange={(e) =>
                setCustomLength(
                  Math.max(1, Math.min(128, parseInt(e.target.value) || 1)),
                )
              }
            />
          </div>
        )}
        <div>
          <Label htmlFor="fingerprint">Fingerprint (CUID2 only)</Label>
          <Input
            id="fingerprint"
            type="text"
            value={fingerprint}
            onChange={(e) => setFingerprint(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="timestamp"
            checked={includeTimestamp}
            onCheckedChange={setIncludeTimestamp}
          />
          <Label htmlFor="timestamp">Include Timestamp</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="slug"
            checked={includeSlug}
            onCheckedChange={setIncludeSlug}
          />
          <Label htmlFor="slug">Include Slug</Label>
        </div>
      </div>
      <Button onClick={generateCuids} className="mb-4 w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        Generate
      </Button>
      {cuids.length > 0 && (
        <>
          <ul className="mb-4 max-h-96 space-y-2 overflow-y-auto">
            {cuids.map((id, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded bg-gray-100 p-2"
              >
                <span className="break-all font-mono text-sm">{id}</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyAsFormat(id, "js")}
                  >
                    JS
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyAsFormat(id, "sql")}
                  >
                    SQL
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCuid(id)}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mb-4 flex gap-2">
            <Button onClick={copyAllToClipboard} className="flex-1">
              <Copy className="mr-2 h-4 w-4" /> Copy All
            </Button>
            <Button onClick={downloadCuids} className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Download CUIDs
            </Button>
          </div>
        </>
      )}
      {selectedCuid && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-4">
            <QRCodeSVG value={selectedCuid} size={256} />
            <Button
              onClick={() => setSelectedCuid(null)}
              className="mt-4 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
