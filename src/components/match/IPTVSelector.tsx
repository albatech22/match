'use client';

import { useEffect, useState } from 'react';
import { fetchSportsChannels, IPTVChannel } from '@/lib/iptv';
import { Search, Tv, Star, Signal, Wifi } from 'lucide-react';

interface IPTVSelectorProps {
    onSelectChannel: (url: string) => void;
    match?: any; // Context for smart selection
}

export default function IPTVSelector({ onSelectChannel, match }: IPTVSelectorProps) {
    const [channels, setChannels] = useState<IPTVChannel[]>([]);
    const [filteredChannels, setFilteredChannels] = useState<IPTVChannel[]>([]);
    const [recommendedChannels, setRecommendedChannels] = useState<IPTVChannel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadChannels();
    }, []);

    useEffect(() => {
        if (channels.length === 0) return;

        // Smart Recommendation Logic
        if (match) {
            const home = match.homeTeam?.name?.toLowerCase() || '';
            const away = match.awayTeam?.name?.toLowerCase() || '';
            const league = match.league?.toLowerCase() || '';
            const category = match.category?.toLowerCase() || '';

            const scoredChannels = channels.map(channel => {
                let score = 0;
                const name = channel.name.toLowerCase();
                const group = channel.group?.toLowerCase() || '';

                // High relevance: Exact team name match
                if (home && name.includes(home)) score += 20;
                if (away && name.includes(away)) score += 20;

                // Medium relevance: League match
                if (league && (name.includes(league) || group.includes(league))) score += 10;

                // Broad relevance: Sport specific (though all are sports here)
                if (category && name.includes(category)) score += 5;

                // Major broadcasters often carry big games
                if (name.includes('beinsports') || name.includes('bein sports')) score += 2;
                if (name.includes('canal+')) score += 2;
                if (name.includes('sky sports')) score += 2;
                if (name.includes('espn')) score += 2;
                if (name.includes('dazn')) score += 2;

                return { ...channel, score };
            });

            // Filter channels with a decent score
            const recs = scoredChannels
                .filter(c => c.score > 0)
                .sort((a, b) => b.score - a.score) // Sort by score DESC
                .slice(0, 10); // Top 10

            setRecommendedChannels(recs);
        }

    }, [channels, match]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredChannels(channels);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredChannels(
                channels.filter(c => c.name.toLowerCase().includes(query))
            );
        }
    }, [searchQuery, channels]);

    const loadChannels = async () => {
        setIsLoading(true);
        const data = await fetchSportsChannels();
        setChannels(data);
        setFilteredChannels(data);
        setIsLoading(false);
    };

    return (
        <div className="w-full bg-zinc-900/50 rounded-2xl border border-white/5 p-4 flex flex-col gap-4 h-[600px]">
            {/* Header & Search */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-white font-bold">
                    <Tv className="w-5 h-5 text-accent-cyan" />
                    <span>Chaînes TV</span>
                    <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                        {channels.length}
                    </span>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Rechercher une chaîne (ex: BeIN, Canal+)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                    />
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">

                {/* Recommended Section */}
                {recommendedChannels.length > 0 && !searchQuery && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-accent-cyan uppercase tracking-wider px-1">
                            <Star className="w-3 h-3 fill-accent-cyan" />
                            Recommandé pour ce match
                        </div>
                        <div className="grid gap-2">
                            {recommendedChannels.map(channel => (
                                <ChannelRow key={`rec-${channel.id}`} channel={channel} onSelect={onSelectChannel} isRecommended />
                            ))}
                        </div>
                    </div>
                )}

                {/* All Channels Section */}
                <div className="space-y-2">
                    {!searchQuery && recommendedChannels.length > 0 && (
                        <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider px-1 mt-4">
                            Toutes les chaînes
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/30">
                            <div className="w-8 h-8 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
                            <span className="text-xs">Chargement de la playlist...</span>
                        </div>
                    ) : filteredChannels.length > 0 ? (
                        <div className="grid gap-2">
                            {filteredChannels.map((channel) => (
                                <ChannelRow key={channel.id} channel={channel} onSelect={onSelectChannel} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-secondary py-12 text-sm">
                            Aucune chaîne trouvée pour "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ChannelRow({ channel, onSelect, isRecommended }: { channel: any, onSelect: (url: string) => void, isRecommended?: boolean }) {
    return (
        <button
            onClick={() => onSelect(channel.url)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group text-left border relative overflow-hidden ${isRecommended
                    ? 'bg-accent-cyan/5 border-accent-cyan/30 hover:bg-accent-cyan/10'
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
        >
            {/* Glow effect for recommended */}
            {isRecommended && <div className="absolute top-0 left-0 w-1 h-full bg-accent-cyan/50" />}

            <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {channel.logo ? (
                    <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : (
                    <Tv className="w-5 h-5 text-white/20" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-medium transition-colors truncate ${isRecommended ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                        {channel.name}
                    </h4>
                    {isRecommended && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-cyan text-black">Top</span>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs text-secondary">
                    {channel.group && (
                        <span className="truncate max-w-[100px]">{channel.group}</span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-1 text-green-500/80">
                        <Wifi className="w-3 h-3" />
                        <span className="text-[10px]">HD</span>
                    </div>
                </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Tv className="w-4 h-4 fill-current" />
                </div>
            </div>
        </button>
    )
}
