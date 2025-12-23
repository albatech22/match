import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './ContentTabs.module.css'

export default function ContentTabs() {
    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${styles.active}`}>TOUS</button>
                <button className={styles.tab}>DIRECT</button>
                <button className={styles.tab}>COTES</button>
                <button className={styles.tab}>TERMINÉS</button>
                <button className={styles.tab}>PRÉVUS</button>
            </div>

            <div className={styles.datePicker}>
                <button className={styles.iconBtn}><ChevronLeft size={14} /></button>
                <div className={styles.date}>
                    <Calendar size={14} />
                    <span>21/12 DI</span>
                </div>
                <button className={styles.iconBtn}><ChevronRight size={14} /></button>
            </div>
        </div>
    )
}
