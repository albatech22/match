'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import { useStandings } from '@/hooks/useSportData';

import IPTVSelector from './IPTVSelector';

const TABS = [
    { id: 'summary', label: 'RÉSUMÉ' },
    { id: 'stats', label: 'STATISTIQUES' },
    { id: 'streaming', label: 'REGARDER' },
    { id: 'iptv', label: 'CHAÎNES TV' },
    { id: 'lineups', label: 'COMPOSITIONS' },
    { id: 'h2h', label: 'H2H' },
    { id: 'table', label: 'CLASSEMENT' },
];

interface MatchTabsProps {
    videoUrl?: string;
    matchTitle?: string;
    match?: any;
}

// Utility function to add ad-blocking parameters to embed URL
function buildAdFreeEmbedUrl(baseUrl: string): string {
    try {
        if (baseUrl.endsWith('.m3u8')) return baseUrl; // Don't modify HLS streams

        const url = new URL(baseUrl);
        // Add multiple anti-ad parameters
        url.searchParams.set('noad', '1');
        url.searchParams.set('notrack', '1');
        url.searchParams.set('adblock', '1');
        url.searchParams.set('muted', '0');
        return url.toString();
    } catch (e) {
        // If URL parsing fails, append parameters manually
        if (baseUrl.endsWith('.m3u8')) return baseUrl;
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}noad=1&notrack=1&adblock=1&muted=0`;
    }
}

export default function MatchTabs({ videoUrl, matchTitle, match }: MatchTabsProps) {
    const [activeTab, setActiveTab] = useState(videoUrl ? 'streaming' : 'summary');
    const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
    const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

    const handleIPTVSelect = (url: string) => {
        setCustomVideoUrl(url);
        setActiveTab('streaming');
    };

    // Determine the effective URL to show
    const effectiveUrl = customVideoUrl || videoUrl;

    return (
        <div className="w-full">
            {/* Tab Bar */}
            <div className="sticky top-0 z-30 bg-[#121212] border-b border-white/5">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[1000px] mx-auto px-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-accent-cyan' : 'text-secondary hover:text-white'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-[1000px] mx-auto py-6 px-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'summary' && <SummaryTab key="summary" events={match?.events} stadium={match?.stadium} referee={match?.referee} />}
                    {activeTab === 'stats' && <StatsTab key="stats" />}
                    {activeTab === 'streaming' && (
                        <motion.div key="streaming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full space-y-4">
                            {effectiveUrl ? (
                                <VideoPlayer url={buildAdFreeEmbedUrl(effectiveUrl)} title={matchTitle || 'Streaming'} />
                            ) : match?.sources && match.sources.length > 0 && !customVideoUrl ? (
                                <VideoPlayer
                                    url={buildAdFreeEmbedUrl(
                                        (match.sources[selectedSourceIndex] as any).embedUrl ||
                                        `https://westream.su/embed/${match.sources[selectedSourceIndex].source}/${match.sources[selectedSourceIndex].id}`
                                    )}
                                    title={matchTitle || match?.title || 'Live Stream'}
                                />
                            ) : (
                                <div className="w-full aspect-video flex flex-col items-center justify-center text-secondary gap-3 bg-[#111] rounded-xl border border-white/5">
                                    <div className="text-4xl animate-bounce">📡</div>
                                    <div className="text-sm font-bold uppercase tracking-widest text-secondary/60">Flux Non Disponible</div>
                                    <p className="text-xs text-secondary/40">Le lien de diffusion apparaîtra peu avant le match</p>
                                </div>
                            )}

                            {/* Source Selector (if multiple) */}
                            {match?.sources && match.sources.length > 1 && !customVideoUrl && (
                                <div className="flex flex-wrap gap-2">
                                    {match.sources.map((src: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSourceIndex(idx)}
                                            className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all ${selectedSourceIndex === idx
                                                ? 'bg-accent-cyan text-black border-accent-cyan'
                                                : 'bg-[#1a1a1a] border-white/5 hover:border-accent-cyan/50 text-white'
                                                }`}
                                        >
                                            Source {idx + 1} {src.source && `(${src.source.toUpperCase()})`}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {customVideoUrl && (
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setCustomVideoUrl(null)}
                                        className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors"
                                    >
                                        Fermer la chaîne TV
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                    {activeTab === 'iptv' && (
                        <motion.div key="iptv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <IPTVSelector onSelectChannel={handleIPTVSelect} match={match} />
                        </motion.div>
                    )}
                    {activeTab === 'lineups' && <LineupsTab key="lineups" />}
                    {activeTab === 'table' && <ClassificationTab key="table" match={match} />}
                </AnimatePresence>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function SummaryTab({ events, stadium, referee }: any) {
    const firstHalfEvents = events?.filter((e: any) => parseInt(e.time) <= 45) || [];
    const secondHalfEvents = events?.filter((e: any) => parseInt(e.time) > 45) || [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Match Events */}
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5">
                {firstHalfEvents.length > 0 && (
                    <>
                        <div className="px-4 py-2 bg-[#222] text-xs font-bold text-secondary uppercase tracking-wider border-b border-white/5">1ère Mi-temps</div>
                        {firstHalfEvents.map((e: any, i: number) => (
                            <EventRow key={i} {...e} />
                        ))}
                    </>
                )}
                {secondHalfEvents.length > 0 && (
                    <>
                        <div className="px-4 py-2 bg-[#222] text-xs font-bold text-secondary uppercase tracking-wider border-y border-white/5 mt-[-1px]">2ème Mi-temps</div>
                        {secondHalfEvents.map((e: any, i: number) => (
                            <EventRow key={i} {...e} />
                        ))}
                    </>
                )}
                {!events && (
                    <div className="p-8 text-center text-secondary text-sm">Aucun événement disponible.</div>
                )}
            </div>

            {/* Info Box */}
            {(stadium || referee) && (
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    {stadium && <div className="text-secondary text-xs font-medium">📍 {stadium}</div>}
                    {referee && <div className="text-secondary text-xs font-medium">🏁 Arbitre: {referee}</div>}
                </div>
            )}
        </motion.div>
    );
}

// Helper to map league names to API codes
function getLeagueCode(leagueName?: string): string {
    if (!leagueName) return 'PL'; // Default to PL if unknown

    const lower = leagueName.toLowerCase();

    // Major Leagues Mappings
    if (lower.includes('premier') || lower.includes('england')) return 'PL';
    if (lower.includes('champions') || lower.includes('ucl')) return 'CL';
    if (lower.includes('liga') || lower.includes('spain')) return 'LL';
    if (lower.includes('serie a') || lower.includes('italy')) return 'SA';
    if (lower.includes('bundesliga') || lower.includes('germany')) return 'BL';
    if (lower.includes('ligue 1') || lower.includes('france')) return 'L1';
    if (lower.includes('eredivisie') || lower.includes('netherlands')) return 'DED';
    if (lower.includes('primeira') || lower.includes('portugal')) return 'PPL';

    // Default fallback
    return 'PL';
}

function ClassificationTab({ match }: any) {
    const leagueCode = getLeagueCode(match?.league || match?.category);
    const { standings, isLoading } = useStandings(leagueCode);

    // Filter standings to show relevant rows (top teams + context around current match teams)
    // If we have data, try to find our teams in it
    const relevantStandings = (() => {
        if (!standings || !Array.isArray(standings) || standings.length === 0) return [];

        // If we can't find specific team context, just show top 10
        const homeName = match?.homeTeam?.name || match?.teams?.home?.name || '';
        const awayName = match?.awayTeam?.name || match?.teams?.away?.name || '';

        // Ideally we would scroll to the teams, but for now let's just show the full table or top 20
        return standings.slice(0, 20);
    })();

    if (isLoading) {
        return (
            <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-8 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (!standings || !Array.isArray(standings) || standings.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 p-6 text-center text-secondary">
                Classement non disponible pour cette compétition.
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-[#222] text-secondary font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 w-10">#</th>
                            <th className="px-4 py-3">Équipe</th>
                            <th className="px-4 py-3 text-center">J</th>
                            <th className="px-4 py-3 text-center">G</th>
                            <th className="px-4 py-3 text-center">N</th>
                            <th className="px-4 py-3 text-center">P</th>
                            <th className="px-4 py-3 text-center">+/-</th>
                            <th className="px-4 py-3 text-center text-white">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {relevantStandings.map((team: any, i: number) => {
                            // Normalize data access (API vs potential other formats)
                            const teamName = team.team?.name || team.team || team.name || 'Unknown';
                            const position = team.position || team.rank || (i + 1);
                            const played = team.played || team.p || 0;
                            const won = team.won ?? team.win ?? team.w ?? 0;
                            const drawn = team.drawn ?? team.draw ?? team.d ?? 0;
                            const lost = team.lost ?? team.loss ?? team.l ?? 0;
                            const points = team.points ?? team.pts ?? 0;

                            // Calculate GD if not present
                            let gd = team.goals_diff ?? team.gd;
                            if (gd === undefined && team.goals_for !== undefined && team.goals_against !== undefined) {
                                gd = team.goals_for - team.goals_against;
                            }
                            // Format GD to have + sign if positive
                            const formattedGd = gd > 0 ? `+${gd}` : gd;

                            // Highlight match teams
                            const isMatchTeam =
                                (match?.homeTeam?.name && teamName.includes(match.homeTeam.name)) ||
                                (match?.awayTeam?.name && teamName.includes(match.awayTeam.name));

                            // Determine rank color
                            const rankNum = parseInt(position);
                            let rankClass = "text-secondary";
                            if (rankNum <= 4) rankClass = "text-accent-cyan font-bold";
                            else if (rankNum >= standings.length - 3) rankClass = "text-red-500 font-bold";

                            return (
                                <tr key={i} className={`hover:bg-white/5 transition-colors ${isMatchTeam ? 'bg-accent-cyan/10 border-l-2 border-accent-cyan' : ''}`}>
                                    <td className={`px-4 py-3 font-mono ${rankClass}`}>{position}</td>
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <span className={`font-bold ${isMatchTeam ? 'text-accent-cyan' : 'text-white'}`}>{teamName}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-secondary">{played}</td>
                                    <td className="px-4 py-3 text-center text-secondary/70">{won}</td>
                                    <td className="px-4 py-3 text-center text-secondary/70">{drawn}</td>
                                    <td className="px-4 py-3 text-center text-secondary/70">{lost}</td>
                                    <td className="px-4 py-3 text-center text-secondary">{formattedGd}</td>
                                    <td className="px-4 py-3 text-center font-black text-white">{points}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend or info */}
            <div className="px-4 py-2 bg-[#222] border-t border-white/5 flex gap-4 text-[10px] text-secondary uppercase tracking-wider justify-center">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent-cyan"></div> Qualification</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Relégation</div>
            </div>
        </motion.div>
    );
}

function StatsTab() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <StatRow label="Possession" home="55%" away="45%" homeVal={55} />
            <StatRow label="Tirs" home="12" away="8" homeVal={60} />
            <StatRow label="Tirs Cadrés" home="5" away="3" homeVal={60} />
            <StatRow label="Corners" home="6" away="4" homeVal={60} />
            <StatRow label="Fautes" home="10" away="12" homeVal={45} />
            <StatRow label="Cartons Jaunes" home="1" away="2" homeVal={33} />
        </motion.div>
    );
}

function LineupsTab() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 p-4 text-center text-secondary text-sm">
            Compositions non disponibles pour ce match.
        </motion.div>
    );
}

// Utility Components
function EventRow({ time, team, type, player, card, assist }: any) {
    const isHome = team === 'home';
    return (
        <div className={`flex items-center py-3 px-4 ${isHome ? 'flex-row' : 'flex-row-reverse'} gap-4 border-b border-white/5 last:border-0`}>
            <div className="w-8 text-xs font-mono text-secondary text-center">{time}</div>
            <div className={`flex-1 flex flex-col ${isHome ? 'items-start' : 'items-end'}`}>
                <span className="text-sm font-bold text-white">{player}</span>
                {assist && <span className="text-xs text-secondary">({assist})</span>}
            </div>
            <div className="w-6 flex justify-center">
                {type === 'goal' && <div className="text-lg">⚽</div>}
                {type === 'card' && <div className={`w-3 h-4 rounded-sm ${card === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>}
                {type === 'sub' && <div className="text-lg">🔄</div>}
            </div>
        </div>
    )
}

function StatRow({ label, home, away, homeVal }: any) {
    return (
        <div className="flex items-center gap-4 py-2">
            <div className="w-8 text-right text-xs font-bold text-white">{home}</div>
            <div className="flex-1 flex items-center gap-1">
                <div className="h-1.5 flex-1 bg-[#222] rounded-full overflow-hidden flex justify-end">
                    <div className="h-full bg-accent-cyan" style={{ width: `${homeVal}%` }}></div>
                </div>
                <div className="w-20 text-center text-[10px] font-bold text-secondary uppercase px-1">{label}</div>
                <div className="h-1.5 flex-1 bg-[#222] rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500" style={{ width: `${100 - homeVal}%` }}></div>
                </div>
            </div>
            <div className="w-8 text-left text-xs font-bold text-white">{away}</div>
        </div>
    )
}
