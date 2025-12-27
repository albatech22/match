'use client';

import { useState, useEffect, useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const context = useContext(ThemeContext);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent rendering until mounted to avoid hydration mismatch
    if (!mounted || !context) {
        return (
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-accent-cyan opacity-50" />
            </div>
        );
    }

    const { theme, toggleTheme } = context;

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 group"
            aria-label={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: theme === 'dark' ? 1 : 0,
                    rotate: theme === 'dark' ? 0 : 180,
                }}
                transition={{ duration: 0.3 }}
                className="absolute"
            >
                <Moon className="w-5 h-5 text-accent-cyan" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    scale: theme === 'light' ? 1 : 0,
                    rotate: theme === 'light' ? 0 : -180,
                }}
                transition={{ duration: 0.3 }}
                className="absolute"
            >
                <Sun className="w-5 h-5 text-yellow-500" />
            </motion.div>
        </button>
    );
}
