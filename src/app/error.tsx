'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          animate={{
            rotate: [0, -5, 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="mb-8"
        >
          <div className="text-9xl mb-4" aria-hidden="true">
            ⚠️
          </div>
        </motion.div>

        <h1 className="text-4xl font-bold text-accent mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-muted text-lg mb-2 leading-relaxed">
          We encountered an unexpected error while loading this page.
        </p>
        <p className="text-muted text-sm mb-8">
          Don&apos;t worry, our team has been notified and we&apos;re working on
          it!
        </p>

        {error.message && (
          <div className="mb-8 p-4 bg-card border border-border rounded-lg text-left">
            <p className="text-xs text-muted font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-8 py-3 text-primary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[200px]"
            style={{
              background:
                'linear-gradient(to right, var(--color-accent), color-mix(in srgb, var(--color-accent), transparent 20%))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(to right, color-mix(in srgb, var(--color-accent), transparent 10%), color-mix(in srgb, var(--color-accent), transparent 30%))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(to right, var(--color-accent), color-mix(in srgb, var(--color-accent), transparent 20%))';
            }}
          >
            Try Again
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-card text-foreground rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium border border-border min-w-[200px]"
            >
              Go to Homepage
            </motion.button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-muted">
          <p>💡 If this problem persists, try:</p>
          <ul className="mt-2 space-y-1">
            <li>• Refreshing the page</li>
            <li>• Clearing your browser cache</li>
            <li>• Checking your internet connection</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
