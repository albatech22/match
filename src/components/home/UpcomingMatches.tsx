'use client'
import MatchCard from '@/components/match/MatchCard'
import { motion } from 'framer-motion'
import { Filter, Radio } from 'lucide-react'

import { useUpcomingMatches } from '@/hooks/useSportData'

export default function UpcomingMatches() {
    const { matches, isLoading } = useUpcomingMatches();


    return (
        <section className="py-12 section-container">
            <div className="flex items-center justify-between mb-8 px-4 md:px-6">
                <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-white flex items-center gap-2"
                >
                    Matchs <span className="text-secondary font-normal">À Venir</span>
                    <span className="ml-3 px-2 py-1 bg-accent/10 border border-accent/30 rounded-md text-xs font-mono text-accent flex items-center gap-1.5">
                        <Radio className="w-3 h-3 animate-pulse" />
                        LIVE SYNC 10s
                    </span>
                </motion.h3>

                <button className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-accent transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtres
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-6">
                {matches?.length > 0 ? (
                    matches.map((match, i) => (
                        <motion.div
                            key={match.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <MatchCard
                                id={match.id}
                                homeTeam={match.home_team || ''}
                                awayTeam={match.away_team || ''}
                                homeBadge={match.home_badge || ''}
                                awayBadge={match.away_badge || ''}
                                homeScore={match.home_score}
                                awayScore={match.away_score}
                                status={match.status || 'NS'}
                                time={match.start_time?.slice(11, 16) || 'TBD'}
                                timer={match.timer}
                            />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-secondary py-10 italic">
                        Aucun match à venir trouvé pour le moment.
                    </div>
                )}
            </div>
        </section>
    )
}
