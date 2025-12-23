/* eslint-disable @next/next/no-img-element */
import styles from './LeagueGroup.module.css'
import { ChevronRight, Pin } from 'lucide-react'

interface LeagueGroupProps {
    name: string
    country: string
    countryCode?: string
    children: React.ReactNode
}

export default function LeagueGroup({ name, country, countryCode, children }: LeagueGroupProps) {
    // Fallback if countryCode is missing (e.g. Europe)
    const flagUrl = countryCode ? `https://flagcdn.com/24x18/${countryCode}.png` : null

    return (
        <div className={styles.group}>
            <div className={styles.header}>
                <div className={styles.info}>
                    {flagUrl && (
                        <img
                            src={flagUrl}
                            srcSet={`https://flagcdn.com/48x36/${countryCode}.png 2x`}
                            width={18}
                            height={13}
                            alt={country}
                            className={styles.flag}
                        />
                    )}
                    <span className={styles.country}>{country}:</span>
                    <span className={styles.name}>{name}</span>
                    <Pin size={12} className={styles.pin} fill="#3B82F6" />
                </div>
                <a href="#" className={styles.link}>
                    Classement <ChevronRight size={14} />
                </a>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}
