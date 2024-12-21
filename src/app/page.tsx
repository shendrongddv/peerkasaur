import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <Button asChild>
          <Link href="/cuid-generator">CUID</Link>
        </Button>
        <Button asChild>
          <Link href="/uuid-generator">UUID</Link>
        </Button>
        <Button asChild>
          <Link href="/ulid-generator">ULID</Link>
        </Button>
        <Button asChild>
          <Link href="/password-generator">Password</Link>
        </Button>
        <Button asChild>
          <Link href="/password-generator-2">Password v2</Link>
        </Button>
      </div>
    </main>
  );
}
