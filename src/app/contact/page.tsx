import { Metadata } from 'next';
import { FaWhatsapp, FaHeart, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'Contact & Support | Kivu Stream',
    description: 'Contactez-nous sur WhatsApp ou rejoignez notre chaîne pour rester informé. Soutenez Kivu Stream.',
};

export default function ContactPage() {
    return (
        <div className="max-w-[1000px] mx-auto py-12 px-4">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-4">
                    CONTACTEZ-<span className="text-accent-cyan">NOUS</span>
                </h1>
                <p className="text-secondary text-lg max-w-[600px] mx-auto">
                    Nous sommes là pour vous aider. Rejoignez notre communauté ou contactez-nous directement.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* WhatsApp Direct Contact */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-accent-cyan/30 transition-all duration-300 group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FaWhatsapp className="text-3xl text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Contact Direct</h2>
                    <p className="text-secondary mb-6 leading-relaxed">
                        Besoin d'aide ou de support ? Contactez-nous directement sur WhatsApp pour une réponse rapide.
                    </p>
                    <a
                        href="https://wa.me/243990634216"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#1ea952] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50"
                    >
                        <FaWhatsapp className="text-2xl" />
                        <span className="text-lg">+243 990 634 216</span>
                    </a>
                </div>

                {/* WhatsApp Channel */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-accent-cyan/30 transition-all duration-300 group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-cyan to-[#00d9ff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FaWhatsapp className="text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Chaîne WhatsApp</h2>
                    <p className="text-secondary mb-6 leading-relaxed">
                        Rejoignez notre chaîne WhatsApp pour recevoir les dernières mises à jour, nouveautés et annonces exclusives.
                    </p>
                    <a
                        href="https://whatsapp.com/channel/0029VbBZI4h545urvfHrxk07"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-[#00FFF7] text-black font-bold px-6 py-4 rounded-xl hover:bg-[#00d9e6] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#00FFF7]/30 hover:shadow-[#00FFF7]/50"
                    >
                        <FaPaperPlane className="text-2xl" />
                        <span className="text-lg">Rejoindre la Chaîne</span>
                    </a>
                </div>
            </div>

            {/* Support Section */}
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <FaHeart className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">
                    Soutenez <span className="text-accent-cyan">Kivu Stream</span>
                </h2>
                <p className="text-secondary text-lg mb-8 max-w-[700px] mx-auto leading-relaxed">
                    Kivu Stream est une plateforme gratuite créée avec passion pour les amateurs de football.
                    Votre soutien nous aide à maintenir et améliorer le service. Contactez-nous sur WhatsApp
                    pour découvrir comment vous pouvez contribuer à notre mission.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                        href="https://wa.me/243990634216?text=Je%20veux%20soutenir%20Kivu%20Stream"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold px-8 py-4 rounded-xl hover:from-[#1ea952] hover:to-[#0f6b5e] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#25D366]/30"
                    >
                        <FaWhatsapp className="text-2xl" />
                        <span className="text-lg">Nous Soutenir</span>
                    </a>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
                <p className="text-secondary text-sm">
                    Nous répondons généralement dans les <span className="text-accent-cyan font-semibold">24 heures</span>
                </p>
            </div>
        </div>
    );
}
