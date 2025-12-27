'use client';

import { Menu, Star, X, Search, Settings, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useLiveMatches } from '@/hooks/useSportData';
import { useState } from 'react';

export default function MobileHeader() {
    const { matches } = useLiveMatches();
    const liveCount = matches?.filter(m => ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(m.status || '')).length || 0;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const competitions = [
        { name: 'Coupe du monde', icon: '🌐' },
        { name: "Coupe d'Afrique des Nations", icon: '🌍' },
        { name: 'Ligue 1', icon: '🇫🇷' },
        { name: 'Ligue 2', icon: '🇫🇷' },
        { name: 'Premier league', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
        { name: 'Liga', icon: '🇪🇸' },
        { name: 'Serie A', icon: '🇮🇹' },
        { name: 'Bundesliga', icon: '🇩🇪' },
        { name: 'Ligue des champions', icon: '🇪🇺' },
        { name: 'Europa League', icon: '🇪🇺' },
    ];

    return (
        <>
            <header className="lg:hidden sticky top-0 z-[100] bg-[#1a1a1a] border-b border-white/5 px-4 h-16 flex items-center justify-between shadow-lg">
                <button
                    className="p-2 text-white/80 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Centered Logo - Updated to KWETU STREAM */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <div className="relative">
                        <Star className="w-9 h-9 text-[#3FE8FF] fill-[#3FE8FF]" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FF2D55] rounded-full border-2 border-[#1a1a1a]" />
                    </div>
                    <div className="flex flex-col leading-[0.85] mt-0.5">
                        <span className="text-xl font-[900] text-white tracking-tighter uppercase font-heading">Kivu</span>
                        <span className="text-xl font-[900] text-white tracking-tighter uppercase font-heading">Stream</span>
                    </div>
                </div>

                {/* Live Badge */}
                <Link href="/live" className="flex items-center gap-1.5 px-3 py-1.5 border border-[#FF2D55]/60 rounded-lg bg-[#FF2D55]/5">
                    <div className="w-1.5 h-1.5 bg-[#FF2D55] rounded-full shadow-[0_0_8px_rgba(255,45,85,0.5)]" />
                    <span className="text-[#FF2D55] font-bold text-[13px] leading-none tracking-tight lowercase">
                        {liveCount} directs
                    </span>
                </Link>
            </header>

            {/* Mobile Sidebar Menu - 100% Replication with small text and KWETU STREAM */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[1000] lg:hidden animate-fade-in">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div className="absolute top-0 left-0 h-full w-[310px] bg-[#111] overflow-y-auto animate-slide-in flex flex-col shadow-2xl">
                        {/* Logo Header - Style matching "FOOT DIRECT" but with "KWETU STREAM" */}
                        <div className="p-8 pt-12 pb-6">
                            <div className="flex items-center gap-3">
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                                    <Star className="w-12 h-12 text-[#3FE8FF] fill-[#3FE8FF]" />
                                    <div className="flex flex-col leading-[0.8] text-white font-[1000] text-3xl tracking-tighter uppercase">
                                        <span>Kivu</span>
                                        <span>Stream</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="ml-auto p-2 text-white/40 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Content with smaller text */}
                        <div className="px-8 pb-12 flex flex-col gap-8">
                            {/* Search Section */}
                            <section>
                                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Rechercher</h2>
                                <div className="h-[1px] w-full bg-white/5" />
                            </section>

                            {/* Competitions Section */}
                            <section>
                                <button className="w-full flex items-center justify-between text-xl font-bold text-white mb-4 group opacity-90 transition-opacity">
                                    <span>Top compétitions</span>
                                    <ChevronDown className="w-5 h-5 text-white/40" />
                                </button>

                                <ul className="space-y-0.5">
                                    {competitions.map((comp) => (
                                        <li key={comp.name}>
                                            <Link
                                                href={`/competition/${comp.name.toLowerCase().replace(/ /g, '-')}`}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-4 py-2 hover:bg-white/5 rounded-lg transition-colors -mx-2 px-2"
                                            >
                                                <span className="text-lg w-6 flex justify-center grayscale group-hover:grayscale-0 transition-all">{comp.icon}</span>
                                                <span className="text-[15px] font-medium text-white/80 group-hover:text-white">
                                                    {comp.name}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <button className="mt-5 px-5 py-2.5 border-[1px] border-[#FF2D55] rounded-sm text-[#FF2D55] font-bold text-[13px] bg-transparent hover:bg-[#FF2D55]/5 transition-colors uppercase tracking-tight w-fit">
                                    Plus de compétitions
                                </button>
                            </section>

                            {/* Settings Section */}
                            <section>
                                <h2 className="text-xl font-bold text-white tracking-tight">Réglages</h2>
                                <div className="h-[1px] w-full bg-white/5 mt-2" />
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto p-8 border-t border-white/5">
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
                                © 2025 Kivu Stream
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-in {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
