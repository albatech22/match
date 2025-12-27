import { PlayCircle, Calendar, Info } from 'lucide-react'
import styles from './Hero.module.css'
import { Match } from '@/types/match'

interface HeroProps {
    match: Match
}

export default function Hero({ match }: HeroProps) {
    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div className={styles.container}>
                <div className={styles.badge}>Match of the Day</div>

                <div className={styles.matchContent}>
                    <div className={styles.team}>
                        <span className={styles.teamName}>{match.homeTeam.name}</span>
                        <span className={styles.score}>{match.homeTeam.score}</span>
                    </div>

                    <div className={styles.vs}>VS</div>

                    <div className={styles.team}>
                        <span className={styles.score}>{match.awayTeam.score}</span>
                        <span className={styles.teamName}>{match.awayTeam.name}</span>
                    </div>
                </div>

                <div className={styles.meta}>
                    <div className={styles.info}>
                        <Calendar size={18} />
                        <span>{match.league?.name} • {match.startTime}</span>
                    </div>
                    <div className={styles.status}>
                        <span className={styles.liveDot}></span>
                        LIVE NOW
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.watchBtn}>
                        <PlayCircle size={20} /> Watch Live
                    </button>
                    <button className={styles.detailsBtn}>
                        <Info size={20} /> Match Details
                    </button>
                </div>
            </div>
        </section>
    )
}
