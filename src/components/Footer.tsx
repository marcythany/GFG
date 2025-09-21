export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="bg-[var(--color-primary-color)] border-t border-[var(--color-secondary-color)] mt-12"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[var(--color-highlight-color)] text-sm sm:text-base">
            © {currentYear} - Made with ❤️ by{' '}
            <a
              href="https://github.com/marcythany"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-color)] hover:text-[var(--color-highlight-color)] transition-colors underline decoration-[var(--color-accent-color)] hover:decoration-[var(--color-highlight-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-color)] focus:ring-offset-2 rounded px-1"
              aria-label="Visit Marcy's GitHub profile - opens in new tab"
            >
              Marcy
            </a>
            . All rights reserved.
          </p>
          <p
            className="text-[var(--color-alt-text-color)] text-xs sm:text-sm mt-2"
            aria-label="Technology stack information"
          >
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
