'use client';

import { motion } from 'framer-motion';

interface StatItem {
    label: string;
    homeValue: number;
    awayValue: number;
    isPercentage?: boolean;
}

export default function MatchStats({ homeName, awayName }: { homeName: string, awayName: string }) {
    // Mock Data Generator for demo purposes
    const stats: StatItem[] = [
        { label: 'Possession', homeValue: 45, awayValue: 55, isPercentage: true },
        { label: 'Tirs', homeValue: 12, awayValue: 15 },
        { label: 'Tirs Cadrés', homeValue: 4, awayValue: 6 },
        { label: 'Passes', homeValue: 450, awayValue: 520 },
        { label: 'Précision de passe', homeValue: 82, awayValue: 88, isPercentage: true },
        { label: 'Fautes', homeValue: 12, awayValue: 8 },
        { label: 'Cartons Jaunes', homeValue: 2, awayValue: 1 },
        { label: 'Corners', homeValue: 5, awayValue: 7 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <span className="w-1 h-6 bg-accent-cyan rounded-full"></span>
                Statistiques du Match
            </h3>

            <div className="flex justify-between text-xs text-secondary font-bold uppercase mb-4 px-2">
                <span className="w-1/3 text-left">{homeName}</span>
                <span className="w-1/3 text-center">Statistique</span>
                <span className="w-1/3 text-right">{awayName}</span>
            </div>

            <div className="space-y-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="group">
                        <div className="flex justify-between text-sm font-bold text-white mb-2 px-2">
                            <span>{stat.homeValue}{stat.isPercentage ? '%' : ''}</span>
                            <span className="text-secondary group-hover:text-white transition-colors">{stat.label}</span>
                            <span>{stat.awayValue}{stat.isPercentage ? '%' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 h-2">
                            {/* Home Bar (Right Aligned within left side) */}
                            <div className="flex-1 flex justify-end bg-white/5 rounded-l-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stat.homeValue / (stat.homeValue + stat.awayValue)) * 100}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className="h-full bg-accent-cyan/80"
                                />
                            </div>

                            {/* Away Bar (Left Aligned within right side) */}
                            <div className="flex-1 flex justify-start bg-white/5 rounded-r-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stat.awayValue / (stat.homeValue + stat.awayValue)) * 100}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className="h-full bg-accent-purple/80"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
