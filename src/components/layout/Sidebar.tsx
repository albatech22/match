/* eslint-disable @next/next/no-img-element */
import { Star, Plus } from 'lucide-react'
import styles from './Sidebar.module.css'

export default function Sidebar() {
    const pinnedLeagues = [
        { id: '1', name: 'Bundesliga', country: 'Allemagne', code: 'de' },
        { id: '2', name: 'Premier League', country: 'Angleterre', code: 'gb-eng' },
        { id: '3', name: 'LaLiga', country: 'Espagne', code: 'es' },
        { id: '4', name: 'Ligue 1', country: 'France', code: 'fr' },
        { id: '5', name: 'Ligue 2', country: 'France', code: 'fr' },
        { id: '6', name: 'Serie A', country: 'Italie', code: 'it' },
        { id: '7', name: 'Liga Portugal', country: 'Portugal', code: 'pt' },
        { id: '8', name: 'CAN', country: 'Afrique', code: 'bef' },
        { id: '9', name: 'Euro', country: 'Europe', code: 'eu' },
    ]

    const countries = [
        'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angleterre', 'Angola', 'Arabie Saoudite', 'Argentine', 'Arménie'
    ]

    return (
        <aside className={styles.sidebar}>
            {/* Pinned Leagues */}
            <div className={styles.section}>
                <h3 className={styles.title}>LIGUES ÉPINGLÉES</h3>
                <ul className={styles.list}>
                    {pinnedLeagues.map(league => (
                        <li key={league.id}>
                            <a href={`/league/${league.id}`} className={styles.link}>
                                <img
                                    src={`https://flagcdn.com/20x15/${league.code}.png`}
                                    width={16}
                                    height={12}
                                    alt={league.country}
                                    className={styles.flag}
                                />
                                <div className={styles.leagueInfo}>
                                    <span className={styles.countryName}>{league.country}</span>
                                    <span className={styles.name}>{league.name}</span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* My Teams */}
            <div className={styles.section}>
                <h3 className={styles.title}>MES ÉQUIPES</h3>
                <div className={styles.teamAction}>
                    <Plus size={14} className={styles.plusIcon} />
                    <span className={styles.addTeam}>AJOUTER L'ÉQUIPE</span>
                </div>
            </div>

            {/* Countries List */}
            <div className={styles.section}>
                <h3 className={styles.title}>PAYS</h3>
                <ul className={styles.gridList}>
                    {countries.map((country, idx) => (
                        <li key={idx}>
                            <a href="#" className={styles.countryLink}>
                                <span className={styles.name}>{country}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
