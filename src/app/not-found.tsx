import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-60 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="link">
        Return Home
      </Link>
    </div>
  );
}
