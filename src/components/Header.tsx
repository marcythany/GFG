import Link from 'next/link';

export default function Header() {
  return (
    <header className="text-center py-8 bg-primary-color">
      <Link href="/">
        <h1 className="text-4xl font-bold text-accent-color cursor-pointer">
          GFG - Good Free Games for you!
        </h1>
      </Link>
    </header>
  );
}
