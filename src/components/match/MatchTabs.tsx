'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import { useStandings, useMatchVideos } from '@/hooks/useSportData';

import IPTVSelector from './IPTVSelector';

const TABS = [
    { id: 'summary', label: 'RÉSUMÉ' },
    { id: 'highlights', label: 'HIGHLIGHTS' },
    { id: 'stats', label: 'STATISTIQUES' },
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
    const [activeTab, setActiveTab] = useState('summary');
    const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
    const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);


    const handleIPTVSelect = (url: string) => {
        setCustomVideoUrl(url);
        setActiveTab('iptv');
    };

    // Determine the effective URL to show
    const effectiveUrl = customVideoUrl || videoUrl;

    return (
        <div className="w-full">
            {/* Video Player Section */}
            <AnimatePresence>
                {effectiveUrl && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="w-full bg-black border-b border-white/5"
                    >
                        <div className="max-w-[1000px] mx-auto">
                            <VideoPlayer
                                url={buildAdFreeEmbedUrl(effectiveUrl)}
                                title={matchTitle || 'Match Stream'}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                    {activeTab === 'highlights' && <HighlightsTab key="highlights" matchId={match?.id} />}
                    {activeTab === 'stats' && <StatsTab key="stats" match={match} />}
                    {activeTab === 'iptv' && (
                        <motion.div key="iptv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <IPTVSelector onSelectChannel={handleIPTVSelect} match={match} />
                        </motion.div>
                    )}
                    {activeTab === 'lineups' && <LineupsTab key="lineups" match={match} />}
                    {activeTab === 'h2h' && <H2HTab key="h2h" match={match} />}
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

export function ClassificationTab({ match }: any) {
    const leagueCode = getLeagueCode(match?.league?.name || match?.league || match?.category);
    // Extract numeric league ID - prioritize the numeric ID from match data
    const leagueId = match?.league?.id && typeof match.league.id === 'number' ? match.league.id : undefined;

    const { standings, isLoading } = useStandings(leagueCode, leagueId);

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

    // Group standings by group (for group stage competitions)
    const groupedStandings: Record<string, any[]> = {};
    let hasGroups = false;

    standings.forEach((team: any) => {
        // Check if team has group information in league_round field
        const groupName = team.league_round || team.group || team.stage || null;
        if (groupName && (groupName.toLowerCase().includes('group') || groupName.toLowerCase().includes('groupe'))) {
            hasGroups = true;
            if (!groupedStandings[groupName]) {
                groupedStandings[groupName] = [];
            }
            groupedStandings[groupName].push(team);
        } else {
            // No group, add to default
            if (!groupedStandings['default']) {
                groupedStandings['default'] = [];
            }
            groupedStandings['default'].push(team);
        }
    });

    // Sort groups alphabetically
    const sortedGroups = Object.keys(groupedStandings).sort();

    const renderStandingsTable = (teams: any[], groupName?: string, showGroupPosition?: boolean) => {
        return (
            <div key={groupName || 'default'} className="overflow-x-auto">
                {groupName && groupName !== 'default' && (
                    <div className="px-4 py-2 bg-[#222] text-sm font-bold text-white border-b border-white/5">
                        {groupName}
                    </div>
                )}
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
                        {teams.map((team: any, i: number) => {
                            const teamName = team.team?.name || team.team || team.name || 'Unknown';
                            // Use index + 1 for group position, or actual position for league tables
                            const position = showGroupPosition ? (i + 1) : (team.position || team.rank || (i + 1));
                            const played = team.played || team.p || 0;
                            const won = team.won ?? team.win ?? team.w ?? 0;
                            const drawn = team.drawn ?? team.draw ?? team.d ?? 0;
                            const lost = team.lost ?? team.loss ?? team.l ?? 0;
                            const points = team.points ?? team.pts ?? 0;

                            let gd = team.goals_diff ?? team.gd;
                            if (gd === undefined && team.goals_for !== undefined && team.goals_against !== undefined) {
                                gd = team.goals_for - team.goals_against;
                            }
                            const formattedGd = gd > 0 ? `+${gd}` : gd;

                            const isMatchTeam =
                                (match?.homeTeam?.name && teamName.includes(match.homeTeam.name)) ||
                                (match?.awayTeam?.name && teamName.includes(match.awayTeam.name));

                            const rankNum = parseInt(position);
                            let rankClass = "text-secondary";
                            if (showGroupPosition) {
                                if (rankNum <= 2) rankClass = "text-accent-cyan font-bold";
                                else if (rankNum >= teams.length - 1 && teams.length > 4) rankClass = "text-red-500 font-bold";
                            } else {
                                if (rankNum <= 4) rankClass = "text-accent-cyan font-bold";
                                else if (rankNum >= standings.length - 3) rankClass = "text-red-500 font-bold";
                            }

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
        );
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden">
            {hasGroups ? (
                <div className="space-y-0">
                    {sortedGroups.map(groupName =>
                        renderStandingsTable(groupedStandings[groupName], groupName, true)
                    )}
                </div>
            ) : (
                renderStandingsTable(groupedStandings['default'] || standings, undefined, false)
            )}

            {/* Legend */}
            <div className="px-4 py-2 bg-[#222] border-t border-white/5 flex gap-4 text-[10px] text-secondary uppercase tracking-wider justify-center">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent-cyan"></div> Qualification</div>
                {!hasGroups && <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Relégation</div>}
            </div>
        </motion.div>
    );
}

function HighlightsTab({ matchId }: { matchId: string }) {
    const { videos, isLoading, isError } = useMatchVideos(matchId);

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 p-8 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin"></div>
            </motion.div>
        );
    }

    if (isError || !videos || videos.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 p-8 text-center">
                <div className="mb-4 text-4xl opacity-30">🎬</div>
                <h3 className="text-lg font-bold text-white mb-2">Aucun Highlight Disponible</h3>
                <p className="text-secondary text-sm">Les highlights vidéo pour ce match ne sont pas encore disponibles.</p>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {videos.map((video: any, index: number) => (
                <div key={index} className="bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="text-accent-cyan">🎬</span>
                            {video.title}
                        </h3>
                    </div>
                    <div className="aspect-video bg-black">
                        <video
                            controls
                            className="w-full h-full"
                            poster={video.thumbnail || undefined}
                            preload="metadata"
                        >
                            <source src={video.url} type="video/mp4" />
                            Votre navigateur ne supporte pas la lecture vidéo.
                        </video>
                    </div>
                </div>
            ))}
        </motion.div>
    );
}

function StatsTab({ match }: any) {
    const statistics = match?.statistics || [];

    if (!statistics || statistics.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 p-8 text-center text-secondary text-sm">
                Statistiques non disponibles pour ce match.
            </motion.div>
        );
    }

    // Helper to parse percentage or number
    const parseValue = (val: string | number): number => {
        if (typeof val === 'number') return val;
        const str = String(val || '0');
        const num = parseFloat(str.replace('%', ''));
        return isNaN(num) ? 0 : num;
    };

    // Helper to calculate percentage for bar
    const calculatePercentage = (home: string | number, away: string | number): number => {
        const homeVal = parseValue(home);
        const awayVal = parseValue(away);
        const total = homeVal + awayVal;
        if (total === 0) return 50;
        return Math.round((homeVal / total) * 100);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {statistics.map((stat: any, index: number) => {
                const homeVal = parseValue(stat.home);
                const awayVal = parseValue(stat.away);
                const homePercentage = calculatePercentage(stat.home, stat.away);

                return (
                    <StatRow
                        key={index}
                        label={stat.type || 'Stat'}
                        home={String(stat.home || '0')}
                        away={String(stat.away || '0')}
                        homeVal={homePercentage}
                    />
                );
            })}
        </motion.div>
    );
}

function LineupsTab({ match }: any) {
    const lineups = match?.lineups;

    if (!lineups || (!lineups.home && !lineups.away)) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 p-8 text-center text-secondary text-sm">
                Compositions non disponibles pour ce match.
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team Lineup */}
                {lineups.home && (
                    <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-4">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            {match.home_badge && <img src={match.home_badge} className="w-6 h-6" alt="" />}
                            {match.home_team}
                        </h3>
                        <div className="space-y-2">
                            {lineups.home.starting_lineups?.map((player: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm py-2 border-b border-white/5 last:border-0">
                                    <span className="text-secondary w-8">{player.lineup_number}</span>
                                    <span className="text-white font-medium">{player.lineup_player}</span>
                                    <span className="text-secondary text-xs ml-auto">{player.lineup_position}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Away Team Lineup */}
                {lineups.away && (
                    <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-4">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            {match.away_badge && <img src={match.away_badge} className="w-6 h-6" alt="" />}
                            {match.away_team}
                        </h3>
                        <div className="space-y-2">
                            {lineups.away.starting_lineups?.map((player: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm py-2 border-b border-white/5 last:border-0">
                                    <span className="text-secondary w-8">{player.lineup_number}</span>
                                    <span className="text-white font-medium">{player.lineup_player}</span>
                                    <span className="text-secondary text-xs ml-auto">{player.lineup_position}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Utility Components
function EventRow({ time, team, type, player, cardType, assist }: any) {
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
                {type === 'card' && <div className={`w-3 h-4 rounded-sm ${cardType === 'yellow' ? 'bg-yellow-400' : cardType === 'red' ? 'bg-red-600' : 'bg-yellow-400'}`}></div>}
                {type === 'sub' && <div className="text-lg">🔄</div>}
            </div>
        </div>
    );
}

function H2HTab({ match }: any) {
    // For H2H, we would need to fetch historical matches between these two teams
    // Since the API doesn't provide a direct H2H endpoint, we'll show team fixtures
    const homeTeamId = match?.homeTeam?.id || match?.home_team_id;
    const awayTeamId = match?.awayTeam?.id || match?.away_team_id;

    if (!homeTeamId || !awayTeamId) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#1a1a1a] rounded-lg border border-white/5 p-8 text-center text-secondary text-sm">
                Données H2H non disponibles.
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Confrontations Directes</h3>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-2xl font-black text-accent-cyan mb-1">-</div>
                        <div className="text-xs text-secondary uppercase tracking-wider">{match?.home_team || 'Domicile'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white/40 mb-1">-</div>
                        <div className="text-xs text-secondary uppercase tracking-wider">Nuls</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-gray-500 mb-1">-</div>
                        <div className="text-xs text-secondary uppercase tracking-wider">{match?.away_team || 'Extérieur'}</div>
                    </div>
                </div>

                {/* Info Message */}
                <div className="bg-[#222] rounded-lg p-4 border border-white/5">
                    <p className="text-sm text-secondary text-center">
                        💡 Les données de confrontations directes ne sont pas disponibles via l'API actuelle.
                        <br />
                        <span className="text-xs text-white/40 mt-2 block">
                            Pour afficher l'historique complet des matchs entre ces équipes, une API premium serait nécessaire.
                        </span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// Utility Components
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
