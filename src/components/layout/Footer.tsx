import Link from 'next/link';
import { FaTwitter, FaInstagram, FaTelegram, FaGithub } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black border-t border-white/5 py-12 mt-20">
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-black text-white italic tracking-tighter">
                            KIVU<span className="text-accent-cyan">STREAM</span>
                        </Link>
                        <p className="text-secondary text-sm leading-relaxed">
                            La référence pour les scores en direct, le streaming et les statistiques du football africain et international.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink href="#" icon={<FaTwitter />} label="Twitter" />
                            <SocialLink href="#" icon={<FaInstagram />} label="Instagram" />
                            <SocialLink href="#" icon={<FaTelegram />} label="Telegram" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Navigation</h3>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="/" className="hover:text-accent-cyan transition-colors">Accueil</Link></li>
                            <li><Link href="/live" className="hover:text-accent-cyan transition-colors">Matchs en Direct</Link></li>
                            <li><Link href="/tv" className="hover:text-accent-cyan transition-colors">Programme TV</Link></li>
                            <li><Link href="/changelog" className="hover:text-accent-cyan transition-colors">Nouveautés</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Légal</h3>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="/about" className="hover:text-accent-cyan transition-colors">À Propos</Link></li>
                            <li><Link href="#" className="hover:text-accent-cyan transition-colors">Confidentialité</Link></li>
                            <li><Link href="#" className="hover:text-accent-cyan transition-colors">Conditions d'utilisation</Link></li>
                            <li><Link href="#" className="hover:text-accent-cyan transition-colors">DMCA</Link></li>
                            <li><Link href="/contact" className="hover:text-accent-cyan transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter (Mock) */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Restez informé</h3>
                        <p className="text-xs text-secondary mb-4">Recevez les dernières mises à jour directement dans votre boîte mail.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-accent-cyan transition-colors"
                            />
                            <button className="bg-accent-cyan text-black font-bold text-xs px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors">
                                OK
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-secondary">
                        &copy; {currentYear} Kivu Stream. Tous droits réservés.
                    </p>
                    <div className="flex gap-2 items-center text-sm">
                        <span className="text-secondary">Fait avec</span>
                        <span className="text-pink-500 animate-pulse">❤️</span>
                        <span className="text-secondary">par</span>
                        <a
                            href="https://idantika.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold bg-gradient-to-r from-accent-cyan via-purple-400 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:via-purple-400 hover:to-accent-cyan transition-all duration-500 hover:scale-110 inline-block"
                        >
                            Idantika
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a
            href={href}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-accent-cyan hover:text-black transition-all duration-300"
            aria-label={label}
        >
            {icon}
        </a>
    );
}
