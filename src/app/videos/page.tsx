'use client';

import { useEffect, useState } from 'react';
import { fetchSportsChannels, IPTVChannel } from '@/lib/iptv';
import { Search, Tv, Star, Wifi, Play, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideosPage() {
    const [channels, setChannels] = useState<IPTVChannel[]>([]);
    const [filteredChannels, setFilteredChannels] = useState<IPTVChannel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChannel, setSelectedChannel] = useState<IPTVChannel | null>(null);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            const data = await fetchSportsChannels();
            setChannels(data);
            setFilteredChannels(data);
            setIsLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredChannels(
            channels.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.group?.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, channels]);

    return (
        <main className="min-h-screen bg-[#050505] pb-20">
            {/* Background Ambient Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                            <span className="font-bold">Kivu Stream</span>
                            <span className="text-white/10">/</span>
                            <span>Chaînes IPTV & Vidéos</span>
                        </div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                            IPTV <span className="text-accent-cyan">SPORTS</span>
                        </h1>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="text"
                            placeholder="Rechercher une chaîne..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#121212] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-accent-cyan/50 transition-all"
                        />
                    </div>
                </div>

                {/* Main Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-12 h-12 border-4 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin"></div>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Chargement des chaînes...</p>
                    </div>
                ) : filteredChannels.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredChannels.map((channel, idx) => (
                                <ChannelCard
                                    key={channel.id || idx}
                                    channel={channel}
                                    onClick={() => setSelectedChannel(channel)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <AlertCircle className="w-12 h-12 text-white/10" />
                        <p className="text-white/20 text-sm font-bold uppercase tracking-widest">Aucune chaîne trouvée</p>
                    </div>
                )}
            </div>

            {/* Video Player Modal */}
            <AnimatePresence>
                {selectedChannel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                        >
                            <button
                                onClick={() => setSelectedChannel(null)}
                                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
                            >
                                <Play className="w-6 h-6 rotate-45 transform" />
                            </button>

                            {/* In a real scenario, this would be an HLS player. 
                                For demonstration, we'll show a message or use an iframe if possible. */}
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black p-10 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-accent-cyan/10 flex items-center justify-center mb-6">
                                    <Tv className="w-10 h-10 text-accent-cyan" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase mb-2">{selectedChannel.name}</h3>
                                <p className="text-white/40 text-sm max-w-md mb-8">Flux IPTV direct : {selectedChannel.url}</p>
                                <div className="flex gap-4">
                                    <button className="px-8 py-3 bg-accent-cyan text-black font-black uppercase rounded-xl hover:scale-105 transition-transform">
                                        Lancer le lecteur
                                    </button>
                                    <button
                                        onClick={() => setSelectedChannel(null)}
                                        className="px-8 py-3 bg-white/5 text-white font-black uppercase rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function ChannelCard({ channel, onClick }: { channel: IPTVChannel, onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            onClick={onClick}
            className="group cursor-pointer bg-[#121212] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full transition-all hover:border-accent-cyan/30 hover:shadow-[0_0_20px_rgba(0,255,247,0.05)]"
        >
            <div className="aspect-[16/9] bg-black p-8 flex items-center justify-center relative group-hover:bg-accent-cyan/5 transition-colors">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 bg-accent-cyan rounded-full flex items-center justify-center text-black shadow-lg shadow-accent-cyan/20 scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                </div>

                {channel.logo ? (
                    <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                    />
                ) : (
                    <Tv className="w-16 h-16 text-white/5 group-hover:text-accent-cyan/20 transition-colors" />
                )}
            </div>

            <div className="p-5 flex flex-col gap-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors truncate">
                        {channel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase tracking-widest">
                        <Wifi className="w-2.5 h-2.5" />
                        HD
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        {channel.group || 'Divers'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                    <span className="text-[10px] font-bold text-accent-cyan/60 uppercase tracking-widest">
                        Libre
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
