'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import ReplayModal from '@/components/ui/ReplayModal'

export default function HighlightsGrid() {
    const [selectedVideo, setSelectedVideo] = useState<{ title: string } | null>(null)

    const highlights = [
        { id: 1, title: 'GOAL! Haaland 89\' vs Liverpool', duration: '0:45', thumbnail: '/assets/images/thumb1.jpg' },
        { id: 2, title: 'Incredible Save by Courtois', duration: '0:32', thumbnail: '/assets/images/thumb2.jpg' },
        { id: 3, title: 'Mbappe Solo Run Goal', duration: '1:12', thumbnail: '/assets/images/thumb3.jpg' },
        { id: 4, title: 'Red Card Controversy Analysis', duration: '2:30', thumbnail: '/assets/images/thumb4.jpg' },
    ]

    return (
        <section className="py-10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white tracking-wide">Highlights & Replays</h3>
                <button className="text-[#00FFF7] text-sm font-medium hover:underline">View All</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {highlights.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedVideo({ title: item.title })}
                        className="group relative aspect-video bg-[#1A1A1A] rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#7F5AF0]/50 transition-colors"
                    >
                        {/* Thumbnail Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-500"></div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-10 h-10 bg-[#7F5AF0] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(127,90,240,0.6)]">
                                <Play size={16} fill="white" className="text-white ml-0.5" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                            <div className="text-xs font-mono text-[#00FFF7] mb-1">{item.duration}</div>
                            <div className="text-sm font-bold text-white leading-tight line-clamp-2">{item.title}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <ReplayModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                title={selectedVideo?.title || ''}
            />
        </section>
    )
}
