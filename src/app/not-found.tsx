import Link from "next/link";

export default function NotFound() {
  return (
    <section className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-white text-black">
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-3xl font-bold text-black/10">404 | Not Found</h2>
        <p className="text-gray-600 capitalize">
          Could not find requested resource
        </p>
        <Link
          href="/"
          className="py-1 px-2 border rounded-md text-sm hover:border-black/30 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
