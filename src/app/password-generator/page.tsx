"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Loader2, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function PasswordGenerator() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [length, setLength] = useState(16);
  const [passwordCount, setPasswordCount] = useState(1);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [excludeSimilarChars, setExcludeSimilarChars] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePasswords = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let charset = "";
      if (includeUppercase) charset += "ABCDEFGHJKLMNPQRSTUVWXYZ";
      if (includeLowercase) charset += "abcdefghijkmnpqrstuvwxyz";
      if (includeNumbers) charset += "23456789";
      if (includeSpecialChars) charset += "!@#$%^&*()_+{}[]|:;<>,.?/~";

      if (excludeSimilarChars) {
        charset = charset.replace(/[Il1O0]/g, "");
      }

      if (charset === "") {
        toast({
          title: "Error",
          description: "Please select at least one character type.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      const newPasswords = Array.from({ length: passwordCount }, () => {
        let newPassword = "";
        for (let i = 0; i < length; i++) {
          newPassword += charset.charAt(
            Math.floor(Math.random() * charset.length),
          );
        }
        return newPassword;
      });

      setPasswords(newPasswords);
      setIsGenerating(false);
    }, 0); // 4 seconds delay
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard.",
    });
  };

  const exportPasswords = () => {
    const content = passwords.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\..+/, "");
    link.download = `generated_passwords_${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Exported!",
      description: "Passwords exported as a text file.",
    });
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
        <CardDescription>Generate strong, secure passwords</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Password Length: {length}
          </label>
          <Slider
            min={8}
            max={32}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Number of Passwords: {passwordCount}
          </label>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[passwordCount]}
            onValueChange={(value) => setPasswordCount(value[0])}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Include:</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked: boolean) =>
                  setIncludeUppercase(checked)
                }
              />
              <label htmlFor="uppercase">Uppercase</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={(checked: boolean) =>
                  setIncludeLowercase(checked)
                }
              />
              <label htmlFor="lowercase">Lowercase</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked: boolean) =>
                  setIncludeNumbers(checked)
                }
              />
              <label htmlFor="numbers">Numbers</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="special"
                checked={includeSpecialChars}
                onCheckedChange={(checked: boolean) =>
                  setIncludeSpecialChars(checked)
                }
              />
              <label htmlFor="special">Special Characters</label>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="excludeSimilar"
            checked={excludeSimilarChars}
            onCheckedChange={(checked: boolean) =>
              setExcludeSimilarChars(checked)
            }
          />
          <label htmlFor="excludeSimilar">
            Exclude similar characters (I, l, 1, O, 0)
          </label>
        </div>
        {passwords.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Passwords:</label>
            <div className="space-y-2">
              {passwords.map((password, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={password}
                    readOnly
                    className="flex-grow rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={() => copyPassword(password)} size="icon">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy password</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={generatePasswords}
          className="w-1/2"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Passwords"
          )}
        </Button>
        {passwords.length > 0 && (
          <Button onClick={exportPasswords} className="ml-2 w-1/2">
            <Download className="mr-2 h-4 w-4" />
            Export Passwords
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
