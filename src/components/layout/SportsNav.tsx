import styles from './SportsNav.module.css'
import { Star, Trophy, Activity, Target, Disc } from 'lucide-react' // Using Disc as Hockey puck proxy

export default function SportsNav() {
    return (
        <div className={styles.nav}>
            <div className={styles.container}>
                <a href="#" className={styles.item}>
                    <Star size={14} />
                    <span>FAVORIS <span className={styles.badge}>0</span></span>
                </a>
                <a href="#" className={`${styles.item} ${styles.active}`}>
                    <Trophy size={14} />
                    <span>FOOTBALL</span>
                </a>
                <a href="#" className={styles.item}>
                    <Activity size={14} />
                    <span>TENNIS</span>
                </a>
                <a href="#" className={styles.item}>
                    <Target size={14} />
                    <span>BASKET</span>
                </a>
                <a href="#" className={styles.item}>
                    <Disc size={14} />
                    <span>HOCKEY</span>
                </a>
            </div>
        </div>
    )
}
