'use client';

import { useState, useEffect } from 'react';
import { Search, Menu, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#121212] border-b border-white/5 h-16`}
        >
            <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="text-xl font-black italic tracking-tighter text-white">
                        KIVU <span className="text-accent-cyan">STREAM</span>
                    </div>
                </Link>

                {/* SEARCH (Center) */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Rechercher équipe, compétition..."
                            className="w-full bg-white/5 border-none rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-accent-cyan/50"
                        />
                    </div>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-white/70 hover:text-white transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#121212]"></span>
                    </button>

                    <button className="w-8 h-8 rounded-full bg-accent-cyan text-black font-bold flex items-center justify-center text-xs">
                        JD
                    </button>

                    <Menu className="md:hidden w-6 h-6 text-white cursor-pointer" />
                </div>
            </div>
        </motion.header>
    );
}
