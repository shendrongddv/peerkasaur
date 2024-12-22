"use client";

import { useState, useEffect } from "react";
import { differenceInSeconds, addYears } from "date-fns";

interface CountdownProps {
  birthdate: Date;
}

export default function BirthdayCountdown({ birthdate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let nextBirthday = new Date(
      currentYear,
      birthdate.getMonth(),
      birthdate.getDate(),
    );

    if (nextBirthday < now) {
      nextBirthday = addYears(nextBirthday, 1);
    }

    const diff = differenceInSeconds(nextBirthday, now);

    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);
    const seconds = diff % 60;

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthdate]);

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-semibold">
        Countdown to Your Next Birthday
      </h2>
      <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
        <div className="rounded-lg bg-blue-100 p-4">
          <div className="text-4xl font-bold">{timeLeft.days}</div>
          <div className="text-sm text-gray-600">Days</div>
        </div>
        <div className="rounded-lg bg-green-100 p-4">
          <div className="text-4xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm text-gray-600">Hours</div>
        </div>
        <div className="rounded-lg bg-yellow-100 p-4">
          <div className="text-4xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-600">Minutes</div>
        </div>
        <div className="rounded-lg bg-red-100 p-4">
          <div className="text-4xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-600">Seconds</div>
        </div>
      </div>
    </div>
  );
}
