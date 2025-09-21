export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="bg-primary-color border-t border-secondary-color mt-12"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-highlight-color text-responsive-sm">
            © {currentYear} - Made with ❤️ by{' '}
            <a
              href="https://github.com/marcythany"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-color hover:text-highlight-color transition-colors underline decoration-accent-color hover:decoration-highlight-color focus:outline-none focus:ring-2 focus:ring-accent-color focus:ring-offset-2 rounded px-1"
              aria-label="Visit Marcy's GitHub profile - opens in new tab"
            >
              Marcy
            </a>
            . All rights reserved.
          </p>
          <p
            className="text-alt-text-color text-responsive-xs mt-2"
            aria-label="Technology stack information"
          >
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
