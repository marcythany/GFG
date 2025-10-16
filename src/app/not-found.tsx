'use client';

import { motion } from 'framer-motion';

export default function NotFound() {
  const handleGoHome = () => {
    // Force a full page reload to reset all state
    window.location.href = '/';
  };

  const handleBrowseAll = () => {
    // Force a full page reload to reset all state
    window.location.href = '/?platform=all';
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
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="mb-8 flex justify-center"
        >
          <div className="text-7xl sm:text-8xl md:text-9xl mb-6" aria-hidden="true">
            🎮
          </div>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-accent mb-5">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-6">
          Page Not Found
        </h2>
        <p className="text-muted text-base sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might
          have been moved or deleted, or perhaps you mistyped the URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoHome}
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
            Go to Homepage
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBrowseAll}
            className="px-8 py-3.5 bg-card text-foreground rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium border border-border min-w-[200px]"
          >
            Browse All Giveaways
          </motion.button>
        </div>

        <div className="mt-12 text-sm sm:text-base text-muted space-y-2">
          <p>💡 Looking for free games?</p>
          <p>
            Check out our latest giveaways from Epic Games, Steam, GOG, and
            more!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
