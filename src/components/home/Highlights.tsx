'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Clock, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useLiveMatches } from '@/hooks/useSportData'

export default function Highlights() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null)
    const { matches } = useLiveMatches();

    // Map matches to highlight cards to act as dynamic content
    const highlights = matches?.slice(0, 3).map(m => ({
        id: m.id,
        title: `${m.home_team} vs ${m.away_team} - Full Highlights`,
        date: 'Match Day',
        duration: '10:00',
        thumbnail: m.home_badge || m.away_badge || ''
    })) || [];

    return (
        <section className="py-12 bg-surface/30 px-4 md:px-6">
            <div className="max-w-[1400px] mx-auto">
                <h3 className="text-2xl font-bold text-white mb-8">Highlights & Replays</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {highlights.length > 0 ? (
                        highlights.map((item, i) => (
                            <motion.div
                                key={item.id + i}
                                whileHover={{ y: -5 }}
                                className="group relative aspect-video bg-black rounded-xl overflow-hidden cursor-pointer"
                                onClick={() => setActiveVideo(item.id)}
                            >
                                {/* Thumbnail Background */}
                                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                                    {item.thumbnail ? (
                                        <img src={item.thumbnail} className="w-1/2 h-1/2 object-contain opacity-50 group-hover:scale-110 transition-transform duration-700" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-[url('/assets/images/stadium.jpg')] bg-cover bg-center opacity-40"></div>
                                    )}
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(127,90,240,0.5)]">
                                        <Play className="w-5 h-5 text-white fill-current ml-1" />
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">{item.title}</h4>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>{item.date}</span>
                                        <span className="bg-black/50 px-2 py-0.5 rounded text-white">{item.duration}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-secondary py-12">
                            No highlights available for currently active matches.
                        </div>
                    )}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            {/* In a real implementation this would use the real stream URL or embed */}
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 font-mono gap-4">
                                <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-accent animate-spin"></div>
                                <p>Loading Stream Source {activeVideo}...</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
