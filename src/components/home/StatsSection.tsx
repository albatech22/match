'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStandings, useLiveMatches } from '@/hooks/useSportData'

export default function StatsSection() {
    // If landings endpoint fails or is empty, we can fallback to 'schedule' tab manually
    // But let's try to show the standings if available
    const [activeTab, setActiveTab] = useState<'standings' | 'schedule'>('standings')

    // Real Hooks
    const { standings } = useStandings();
    const { matches: schedule } = useLiveMatches();

    // Helper to separate form string "WWDL" into array
    const parseForm = (formStr: string) => {
        if (!formStr) return [];
        return formStr.split('').slice(0, 5); // Take last 5 chars
    }

    return (
        <section className="py-16 px-4 md:px-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left: Interactive Table */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-white">Season Stats</h3>
                    <div className="flex p-1 bg-surface rounded-lg border border-white/5">
                        <button
                            onClick={() => setActiveTab('standings')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'standings' ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Standings (PL)
                        </button>
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'schedule' ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Schedule
                        </button>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs text-secondary font-mono uppercase tracking-wider">
                            <tr>
                                {activeTab === 'standings' ? (
                                    <>
                                        <th className="p-4 font-normal">#</th>
                                        <th className="p-4 font-normal">Team</th>
                                        <th className="p-4 font-normal text-right">PTS</th>
                                        <th className="p-4 font-normal text-right hidden sm:table-cell">Form</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="p-4 font-normal">Time</th>
                                        <th className="p-4 font-normal">Match</th>
                                        <th className="p-4 font-normal text-right">League</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {/* STANDINGS RENDER */}
                            {activeTab === 'standings' && standings?.length > 0 && standings.map((item, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-default"
                                >
                                    <td className="p-4 text-tertiary font-mono group-hover:text-accent transition-colors">{item.position}</td>
                                    <td className="p-4 font-bold text-white flex items-center gap-3">
                                        {item.team?.badge && <img src={item.team.badge} className="w-6 h-6 object-contain" alt="" />}
                                        {item.team?.name}
                                    </td>
                                    <td className="p-4 text-right font-mono text-accent-cyan font-bold">{item.points}</td>
                                    <td className="p-4 text-right hidden sm:table-cell">
                                        <div className="flex items-center justify-end gap-1">
                                            {parseForm(item.form).map((res: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className={`w-1.5 h-1.5 rounded-full ${res === 'W' ? 'bg-green-500' : res === 'D' ? 'bg-gray-500' : 'bg-red-500'
                                                        }`}
                                                ></span>
                                            ))}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {/* FALLBACK FOR STANDINGS */}
                            {activeTab === 'standings' && (!standings || standings.length === 0) && (
                                <tr><td colSpan={4} className="p-8 text-center text-secondary italic">No standings data available from API currently.</td></tr>
                            )}

                            {/* SCHEDULE RENDER */}
                            {activeTab === 'schedule' && schedule?.slice(0, 8).map((match, i) => (
                                <motion.tr
                                    key={match.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-default"
                                >
                                    <td className="p-4 font-mono text-accent-cyan">{match.status === 'Live' ? 'LIVE' : match.start_time?.slice(11, 16)}</td>
                                    <td className="p-4 font-bold text-white">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                {match.home_badge && <img src={match.home_badge} className="w-4 h-4 object-contain" alt="" />}
                                                {match.home_team}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {match.away_badge && <img src={match.away_badge} className="w-4 h-4 object-contain" alt="" />}
                                                {match.away_team}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-xs text-secondary uppercase tracking-wider">{match.league}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right: Analytical / Promo Graphic */}
            <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-8">Performance Analysis</h3>
                <div className="bg-surface rounded-2xl border border-white/5 p-8 h-[400px] flex items-end justify-between gap-4 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-x-8 top-8 bottom-8 flex flex-col justify-between pointer-events-none">
                        {[100, 75, 50, 25, 0].map(val => (
                            <div key={val} className="w-full h-px bg-white/5 relative">
                                <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] text-tertiary">{val}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Bars (Mock for visual balance, since API doesn't give 'performance %') */}
                    {[65, 82, 45, 90, 70, 55, 88].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                            className="w-full bg-gradient-to-t from-accent/20 to-accent rounded-t-lg relative group hover:to-accent-cyan transition-colors"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
                                Match {i + 1}: {h}%
                            </div>
                        </motion.div>
                    ))}
                </div>
                <p className="mt-4 text-center text-secondary text-sm">Team Efficiency over last 7 matches (Estimated)</p>
            </div>

        </section>
    )
}
