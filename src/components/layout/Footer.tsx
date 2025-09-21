export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="bg-primary border-t border-secondary mt-12"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-muted text-sm sm:text-base">
            © {currentYear} - Made with ❤️ by{' '}
            <a
              href="https://github.com/marcythany"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-muted transition-colors underline decoration-accent hover:decoration-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-1"
              aria-label="Visit Marcy's GitHub profile - opens in new tab"
            >
              Marcy
            </a>
            . All rights reserved.
          </p>
          <p
            className="text-secondary text-xs sm:text-sm mt-2"
            aria-label="Technology stack information"
          >
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
