'use client';

import { Star, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Matchs', icon: MatchsIcon, href: '/' },
    { label: 'Favoris', icon: Star, href: '/favorites' },
    { label: 'Vidéos', icon: PlayIcon, href: '/videos' },
    { label: 'Classement', icon: Trophy, href: '/standings' },
    { label: 'Prog TV', icon: TvIcon, href: '/tv' },
    { label: 'Recherche', icon: Search, href: '/search' },
];

function MatchsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 5v14M3 12h18" />
        </svg>
    )
}

function PlayIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="14" rx="2" />
            <path d="M10 9l5 3-5 3V9z" fill="currentColor" fillOpacity="0.2" />
        </svg>
    )
}

function TvIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="13" rx="2" />
            <path d="M17 2l-5 5-5-5" />
        </svg>
    )
}

function Trophy({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 px-2 pt-2 animate-fade-in-up"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
            <div className="flex items-center justify-between max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-300 active:scale-90 ${isActive ? 'text-[#00FFF7]' : 'text-white/40'}`}
                        >
                            <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#00FFF7]/10' : 'bg-transparent'}`}>
                                <item.icon className="w-5.5 h-5.5" />
                                {isActive && (
                                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#00FFF7] rounded-full shadow-[0_0_8px_rgba(0,255,247,0.8)]" />
                                )}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-tight transition-all duration-300 ${isActive ? 'text-[#00FFF7] opacity-100' : 'opacity-60'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </nav>
    );
}
