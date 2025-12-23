'use client';

import { User } from 'lucide-react';

interface Player {
    name: string;
    number: number;
    position: 'GK' | 'DF' | 'MF' | 'FW';
}

export default function MatchLineups({ homeName, awayName }: { homeName: string, awayName: string }) {
    // Mock Data
    const generateLineup = (): Player[] => [
        { name: "Gardien", number: 1, position: "GK" },
        { name: "Défenseur Droit", number: 2, position: "DF" },
        { name: "Défenseur Central", number: 4, position: "DF" },
        { name: "Défenseur Central", number: 5, position: "DF" },
        { name: "Défenseur Gauche", number: 3, position: "DF" },
        { name: "Milieu", number: 6, position: "MF" },
        { name: "Milieu", number: 8, position: "MF" },
        { name: "Milieu Off", number: 10, position: "MF" },
        { name: "Attaquant", number: 7, position: "FW" },
        { name: "Attaquant", number: 9, position: "FW" },
        { name: "Attaquant", number: 11, position: "FW" },
    ];

    const homeLineup = generateLineup();
    const awayLineup = generateLineup();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <span className="w-1 h-6 bg-accent-purple rounded-full"></span>
                Compositions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Home Team */}
                <div className="bg-surface/50 rounded-2xl p-6 border border-white/5">
                    <h4 className="font-bold text-white mb-4 border-b border-white/5 pb-2 text-center text-accent-cyan uppercase tracking-wider">{homeName}</h4>
                    <div className="space-y-2">
                        {homeLineup.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 font-mono font-bold text-secondary text-sm">
                                    {p.number}
                                </span>
                                <div className="flex-1">
                                    <div className="text-white font-medium">{p.name} {i}</div>
                                    <div className="text-xs text-secondary">{p.position}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Away Team */}
                <div className="bg-surface/50 rounded-2xl p-6 border border-white/5">
                    <h4 className="font-bold text-white mb-4 border-b border-white/5 pb-2 text-center text-accent-purple uppercase tracking-wider">{awayName}</h4>
                    <div className="space-y-2">
                        {awayLineup.map((p, i) => (
                            <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 font-mono font-bold text-secondary text-sm">
                                    {p.number}
                                </span>
                                <div className="flex-1">
                                    <div className="text-white font-medium">{p.name} {i}</div>
                                    <div className="text-xs text-secondary">{p.position}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
