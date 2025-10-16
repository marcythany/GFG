'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

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

  const handleGoHome = () => {
    // Force a full page reload to reset all state
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl w-full"
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
          className="mb-8 flex justify-center"
        >
          <div className="text-7xl sm:text-8xl md:text-9xl mb-6" aria-hidden="true">
            ⚠️
          </div>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-5">
          Oops! Something went wrong
        </h1>
        <p className="text-muted text-base sm:text-lg mb-3 leading-relaxed max-w-2xl mx-auto">
          We encountered an unexpected error while loading this page.
        </p>
        <p className="text-muted text-sm sm:text-base mb-10">
          Don&apos;t worry, our team has been notified and we&apos;re working on
          it!
        </p>

        {error.message && (
          <div className="mb-8 p-4 bg-card border border-border rounded-lg text-left max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-muted font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-8 py-3.5 text-primary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[200px]"
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoHome}
            className="px-8 py-3.5 bg-card text-foreground rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium border border-border min-w-[200px]"
          >
            Go to Homepage
          </motion.button>
        </div>

        <div className="mt-12 text-sm sm:text-base text-muted">
          <p className="mb-3">💡 If this problem persists, try:</p>
          <ul className="space-y-2 text-left max-w-md mx-auto">
            <li>• Refreshing the page</li>
            <li>• Clearing your browser cache</li>
            <li>• Checking your internet connection</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
