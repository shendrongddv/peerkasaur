"use client";

import { useState } from "react";
import { parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BirthdayCountdown from "./_components/birthday-countdown";
import BirthdayInfo from "./_components/birthday-info";

export default function Home() {
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get("birthdate") as string;
    if (date) {
      setBirthdate(parseISO(date));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Birthday Countdown
      </h1>
      <form onSubmit={handleSubmit} className="mb-8 w-full max-w-md">
        <div className="mb-4">
          <Label
            htmlFor="birthdate"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Enter your birthdate
          </Label>
          <Input
            type="date"
            id="birthdate"
            name="birthdate"
            required
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Start Countdown
        </Button>
      </form>
      {birthdate && (
        <div className="w-full max-w-2xl">
          <BirthdayCountdown birthdate={birthdate} />
          <BirthdayInfo birthdate={birthdate} />
        </div>
      )}
    </main>
  );
}
