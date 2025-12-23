'use client'
import { motion } from 'framer-motion'

export default function LiveTicker() {
    const matches = [
        { id: 1, home: 'ARS', away: 'LIV', score: '2-1', time: '74\'', status: 'live' },
        { id: 2, home: 'BAR', away: 'RMA', score: '0-0', time: '12\'', status: 'live' },
        { id: 3, home: 'PSG', away: 'OM', score: '3-0', time: 'FT', status: 'finished' },
        { id: 4, home: 'JUV', away: 'MIL', score: '1-1', time: '45+2\'', status: 'live' },
        { id: 5, home: 'BAY', away: 'DOR', score: '0-1', time: '22\'', status: 'live' },
        { id: 6, home: 'INT', away: 'NAP', score: '2-2', time: '88\'', status: 'live' },
    ]

    return (
        <div className="w-full bg-[#0D0D0D] border-b border-white/5 overflow-hidden py-2 relative z-40">
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#0D0D0D] to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#0D0D0D] to-transparent z-10"></div>

            <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20
                }}
            >
                {/* Duplicating for infinite loop */}
                {[...matches, ...matches, ...matches].map((match, idx) => (
                    <div key={`${match.id}-${idx}`} className="flex items-center gap-3 text-xs font-mono">
                        <span className={`font-bold ${match.status === 'live' ? 'text-white' : 'text-gray-500'}`}>
                            {match.home} <span className={match.status === 'live' ? 'text-[#FF4D4D]' : 'text-gray-600'}>{match.score}</span> {match.away}
                        </span>
                        {match.status === 'live' && (
                            <span className="text-[#00FFF7] animate-pulse">{match.time}</span>
                        )}
                        <div className="w-1 h-1 rounded-full bg-white/10"></div>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
