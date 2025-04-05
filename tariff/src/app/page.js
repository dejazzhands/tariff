import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Welcome to Wildhacks 2025</h1>
      <p>This is the main page of your Next.js application.</p>
          <Link href="/search">
            Go to Search Page
          </Link>
    </main>
  );
}