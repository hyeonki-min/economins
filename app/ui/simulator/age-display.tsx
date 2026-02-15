'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function AgeDisplay({ age }: { age: number }) {
  return (
    <div
      aria-live="polite"
      className="
        relative w-full
        min-h-[80px] sm:min-h-[96px]
        overflow-hidden
        flex items-center justify-center
      "
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={age}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="
            absolute font-bold
            text-5xl sm:text-6xl md:text-7xl
          "
        >
          {age}세
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
