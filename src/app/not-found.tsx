'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
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
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="mb-8"
        >
          <div className="text-9xl mb-4" aria-hidden="true">
            🎮
          </div>
        </motion.div>

        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-muted text-lg mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might
          have been moved or deleted, or perhaps you mistyped the URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
              Go to Homepage
            </motion.button>
          </Link>

          <Link href="/?platform=all">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-card text-foreground rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium border border-border min-w-[200px]"
            >
              Browse All Giveaways
            </motion.button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-muted">
          <p>💡 Looking for free games?</p>
          <p className="mt-2">
            Check out our latest giveaways from Epic Games, Steam, GOG, and
            more!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
