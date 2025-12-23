'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'

interface ReplayModalProps {
    isOpen: boolean
    onClose: () => void
    videoSrc?: string
    title: string
}

export default function ReplayModal({ isOpen, onClose, videoSrc, title }: ReplayModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1A1A1A] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative"
                        >
                            {/* Header */}
                            <div className="p-4 flex items-center justify-between border-b border-white/5">
                                <h3 className="text-white font-bold tracking-wide">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Video Placeholder */}
                            <div className="aspect-video bg-black relative group flex items-center justify-center">
                                {/* Simulate Video Player */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <button className="w-16 h-16 bg-[#7F5AF0] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(127,90,240,0.5)] group-hover:scale-110 transition-transform">
                                    <Play size={24} fill="currentColor" className="ml-1" />
                                </button>
                                <span className="absolute bottom-4 left-4 text-sm font-mono text-white/80">Replay • 1080p • 60fps</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
