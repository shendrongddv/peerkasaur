"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Copy, Star, StarHalf } from "lucide-react";
import { createHash } from "crypto";
import { toast } from "@/hooks/use-toast";

const hashFunctions = [
  {
    name: "MD5",
    algorithm: "md5",
    description:
      "Fast but cryptographically broken. Not suitable for security-critical applications.",
    securityLevel: 1,
  },
  {
    name: "SHA-1",
    algorithm: "sha1",
    description:
      "Deprecated. Collisions have been found. Not recommended for new applications.",
    securityLevel: 2,
  },
  {
    name: "SHA-256",
    algorithm: "sha256",
    description:
      "Part of SHA-2 family. Widely used and considered secure for most applications.",
    securityLevel: 4,
  },
  {
    name: "SHA-512",
    algorithm: "sha512",
    description:
      "Longer variant of SHA-2. Provides extra security margin over SHA-256.",
    securityLevel: 5,
  },

  {
    name: "RIPEMD-160",
    algorithm: "ripemd160",
    description:
      "Used in some blockchain applications. Less common but still considered secure.",
    securityLevel: 3,
  },
];

export default function HashConverter() {
  const [inputString, setInputString] = useState("");
  const [hashResults, setHashResults] = useState<Record<string, string>>({});

  const generateHash = (algorithm: string) => {
    const hash = createHash(algorithm).update(inputString).digest("hex");
    setHashResults((prev) => ({ ...prev, [algorithm]: hash }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Hash has been copied to clipboard.",
      });
    });
  };

  const SecurityRating = ({ level }: { level: number }) => {
    const fullStars = Math.floor(level);
    const hasHalfStar = level % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="h-4 w-4 fill-current text-yellow-400" />
        )}
        {[...Array(5 - Math.ceil(level))].map((_, i) => (
          <Star key={i + fullStars} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold">String to Hash Converter</h1>
        <p className="text-xl text-muted-foreground">
          Convert your string to various hash formats with ease!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hashFunctions.map(
          ({ name, algorithm, description, securityLevel }) => (
            <Card key={algorithm}>
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>Convert string to {name} hash</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter string to hash"
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value)}
                  className="mb-4"
                />
                <Button
                  onClick={() => generateHash(algorithm)}
                  className="mb-4 w-full"
                >
                  Generate {name}
                </Button>
                {hashResults[algorithm] && (
                  <div className="mb-4 break-all rounded-md bg-muted p-2">
                    {hashResults[algorithm]}
                  </div>
                )}
                <div className="mb-2 text-sm text-muted-foreground">
                  {description}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">Security Level:</span>
                  <SecurityRating level={securityLevel} />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => copyToClipboard(hashResults[algorithm] || "")}
                  disabled={!hashResults[algorithm]}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Hash
                </Button>
              </CardFooter>
            </Card>
          ),
        )}
      </div>
      <Toaster />
    </div>
  );
}
