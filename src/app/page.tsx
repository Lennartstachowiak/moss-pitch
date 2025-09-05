import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Presentation System</h1>
      <div className="flex gap-4">
        <Link
          href="/admin"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Admin Panel
        </Link>
        <Link
          href="/viewer"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Viewer
        </Link>
      </div>
    </div>
  );
}
