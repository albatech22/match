/* eslint-disable @next/next/no-img-element */
import { Star } from 'lucide-react'
import styles from './MatchRow.module.css'
import { Match } from '@/types/match'

interface MatchRowProps {
    match: Match
}

export default function MatchRow({ match }: MatchRowProps) {
    const isLive = match.status === 'LIVE'
    const timeDisplay = isLive ? match.time + "'" : "Terminé" // Reference style

    // Mock flag logic for teams (since we don't have separate team country codes in mock yet)
    // We'll mimic the reference where teams have flags.
    // Using generic placeholders or reusing league code for demo if simpler, 
    // but strictly we should add team flags. For now, we use a generic soccer ball icon or similar if no flag.
    // Actually, let's use the league country code as a proxy for the teams for this demo "100% fidelity" visual.
    const teamFlagUrl = `https://flagcdn.com/20x15/${match.countryCode}.png`

    return (
        <div className={styles.row}>
            {/* Left: Star + Status */}
            <div className={styles.statusCol}>
                <Star size={14} className={styles.star} />
                <div className={styles.timeInfo}>
                    {isLive ? <span className={styles.liveTime}>{match.time}'</span> : <span className={styles.finished}>Terminé</span>}
                </div>
            </div>

            {/* Middle: Teams (Stacked) */}
            <div className={styles.teamsCol}>
                {/* Home Team */}
                <div className={`${styles.teamLine} ${(match.homeTeam?.score || 0) > (match.awayTeam?.score || 0) ? styles.winner : ''}`}>
                    <img
                        src={match.homeTeam?.badge || match.home_badge || teamFlagUrl}
                        alt=""
                        className={styles.teamFlag}
                        onError={(e) => (e.currentTarget.src = 'https://flagcdn.com/20x15/world.png')}
                    />
                    <span className={styles.teamName}>{match.homeTeam?.name || match.home_team}</span>
                    <span className={styles.score}>{match.homeTeam?.score ?? match.home_score ?? 0}</span>
                </div>

                {/* Away Team */}
                <div className={`${styles.teamLine} ${(match.awayTeam?.score || 0) > (match.homeTeam?.score || 0) ? styles.winner : ''}`}>
                    <img
                        src={match.awayTeam?.badge || match.away_badge || teamFlagUrl}
                        alt=""
                        className={styles.teamFlag}
                        onError={(e) => (e.currentTarget.src = 'https://flagcdn.com/20x15/world.png')}
                    />
                    <span className={styles.teamName}>{match.awayTeam?.name || match.away_team}</span>
                    <span className={styles.score}>{match.awayTeam?.score ?? match.away_score ?? 0}</span>
                </div>
            </div>

            {/* Right: Info/Spacer (Empty in reference mainly, or more data) */}
            <div className={styles.rightCol}>
            </div>
        </div>
    )
}
