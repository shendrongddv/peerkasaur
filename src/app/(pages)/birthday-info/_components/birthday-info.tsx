import { format, differenceInYears } from "date-fns";
import { id } from "date-fns/locale";

interface BirthdayInfoProps {
  birthdate: Date;
}

export default function BirthdayInfo({ birthdate }: BirthdayInfoProps) {
  const age = differenceInYears(new Date(), birthdate);
  const zodiacSign = getZodiacSign(birthdate);

  function getZodiacSign(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
      return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
      return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
      return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
      return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return "Aquarius";
    return "Pisces";
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-semibold">
        Your Birthday Info
      </h2>
      <div className="space-y-2">
        <p className="text-lg">
          <span className="font-semibold">Birth Date:</span>{" "}
          {format(birthdate, "EEEE, d MMMM yyyy", { locale: id })}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Current Age:</span> {age} years old
        </p>
        <p className="text-lg">
          <span className="font-semibold">Zodiac Sign:</span> {zodiacSign}
        </p>
      </div>
    </div>
  );
}
