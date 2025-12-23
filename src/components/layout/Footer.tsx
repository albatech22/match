import { Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-white/5 py-16">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-3xl font-black italic tracking-tighter text-white mb-4">
                            KIVU <span className="text-accent">STREAM</span>
                        </h3>
                        <p className="text-secondary max-w-sm mb-6 leading-relaxed">
                            La destination ultime pour la couverture sportive. Scores en directs, analyses approfondies et résumés immersifs en temps réel.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary hover:bg-accent hover:text-white transition-all cursor-pointer hover:shadow-lg hover:scale-110">
                                    <Icon className="w-5 h-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Plateforme</h4>
                        <ul className="space-y-4">
                            {['Scores en Direct', 'Résumés', 'Premium', 'Application Mobile'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-secondary hover:text-accent-cyan transition-colors text-sm font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Légal</h4>
                        <ul className="space-y-4">
                            {['Confidentialité', 'Conditions d\'utilisation', 'Cookies', 'Contact'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-secondary hover:text-accent-cyan transition-colors text-sm font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-tertiary uppercase tracking-wider">© 2025 Kivu Stream. Tous droits réservés.</p>

                    {/* Idantika Credit - Premium & SEO Optimized */}
                    <a
                        href="https://idantika.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent-cyan/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-cyan/10"
                        title="DÉVELOPPEMENT WEB ET MOBILE HAUT DE GAMME PAR IDANTIKA"
                        aria-label="Site web de Idantika - Agence de développement"
                    >
                        <span className="text-xs text-secondary/80 font-medium uppercase tracking-wider group-hover:text-white transition-colors">Made with</span>
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-[pulse_1.5s_ease-in-out_infinite] group-hover:scale-125 transition-transform" />
                        <span className="text-xs text-secondary/80 font-medium uppercase tracking-wider group-hover:text-white transition-colors">by</span>
                        <span className="text-sm font-black bg-gradient-to-r from-accent-cyan via-white to-accent-purple bg-clip-text text-transparent group-hover:from-white group-hover:to-accent-cyan transition-all">
                            IDANTIKA
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    )
}
