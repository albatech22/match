import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nouveautés & Mises à jour | Kivu Stream',
    description: 'Découvrez les dernières fonctionnalités et améliorations de Kivu Stream.',
};

export default function ChangelogPage() {
    const changes = [
        {
            version: '1.2.0',
            date: '25 Décembre 2025',
            title: 'Mise à jour "Zeinze" SEO & Stats',
            type: 'major',
            items: [
                '🚀 Optimisation SEO complète : Titres dynamiques, JSON-LD Schema.org, Sitemap & Robots.txt.',
                '📊 Statistiques de match en temps réel (Possession, Tirs, Corners, etc.) connectées à l\'API.',
                '⚡ Affichage du timer live (minutes de jeu) pour les matchs en cours.',
                '🆚 Nouvel onglet H2H (Confrontations directes) sur la page de match.',
                '🎨 Nouveau Footer moderne sur toutes les pages.',
                '🌐 Changement de domaine vers kivustream.live.'
            ]
        },
        {
            version: '1.1.0',
            date: '24 Décembre 2025',
            title: 'Fix & Performance',
            type: 'minor',
            items: [
                '🔧 Correction de l\'affichage des cartons jaunes et rouges.',
                '🔄 Système de rafraîchissement automatique des données toutes les 10 secondes.',
                '🐛 Correction du bug d\'affichage sur mobile pour les cartes de match.',
                '📺 Amélioration du lecteur vidéo (suppression des pubs intempestives).'
            ]
        },
        {
            version: '1.0.0',
            date: '20 Décembre 2025',
            title: 'Lancement Initial',
            type: 'major',
            items: [
                '🎉 Lancement officiel de Kivu Stream.',
                '📱 Interface Mobile-First responsive.',
                '⚽ Scores en direct pour plus de 50 ligues.',
                '📅 Calendrier des matchs et classements.'
            ]
        }
    ];

    return (
        <div className="max-w-[800px] mx-auto py-12 px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-white italic tracking-tighter mb-4">
                    CHANGELOG
                </h1>
                <p className="text-secondary">
                    Suivez l'évolution de <span className="text-accent-cyan font-bold">Kivu Stream</span>. Nous améliorons la plateforme chaque jour.
                </p>
            </div>

            <div className="space-y-12 relative before:content-[''] before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-[2px] before:bg-white/10">
                {changes.map((change, index) => (
                    <div key={index} className="relative pl-12">
                        {/* Timeline Dot */}
                        <div className={`absolute left-0 top-1.5 w-[40px] h-[40px] rounded-full border-4 border-black flex items-center justify-center z-10 ${change.type === 'major' ? 'bg-accent-cyan text-black' : 'bg-[#222] text-white'
                            }`}>
                            {change.type === 'major' ? '🚀' : '✨'}
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-xl p-6 hover:border-accent-cyan/30 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{change.title}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs font-mono bg-white/10 text-white/70 px-2 py-0.5 rounded">v{change.version}</span>
                                        <span className="text-xs text-secondary">{change.date}</span>
                                    </div>
                                </div>
                                {change.type === 'major' && (
                                    <span className="self-start md:self-auto text-[10px] font-bold bg-accent-cyan text-black px-2 py-1 rounded uppercase tracking-wider">
                                        Mise à jour Majeure
                                    </span>
                                )}
                            </div>

                            <ul className="space-y-3">
                                {change.items.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0"></span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
