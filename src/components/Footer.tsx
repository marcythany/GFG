export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-center py-8 mt-8 bg-primary-color">
      <p className="text-highlight-color">
        © {currentYear} - Made with love by Marcy. All rights reserved.
      </p>
    </footer>
  );
}
