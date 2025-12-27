import { Metadata } from 'next';
import Image from 'next/image';
import { FaReact, FaNodeJs, FaGithub, FaLinkedin, FaCode, FaServer, FaMobile, FaDatabase } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql, SiDocker } from 'react-icons/si';

export const metadata: Metadata = {
    title: 'À Propos - Prevue Archimede | Kivu Stream',
    description: 'Découvrez Prevue Archimede, le développeur full-stack derrière Kivu Stream. Expert en React, Next.js, Node.js et technologies web modernes.',
};

export default function AboutPage() {
    const skills = [
        { name: 'Frontend Development', icon: <FaCode />, level: 95 },
        { name: 'Backend Development', icon: <FaServer />, level: 90 },
        { name: 'Mobile Development', icon: <FaMobile />, level: 85 },
        { name: 'Database Design', icon: <FaDatabase />, level: 88 },
    ];

    const technologies = [
        { name: 'React', icon: <FaReact />, color: '#61DAFB' },
        { name: 'Next.js', icon: <SiNextdotjs />, color: '#ffffff' },
        { name: 'TypeScript', icon: <SiTypescript />, color: '#3178C6' },
        { name: 'Node.js', icon: <FaNodeJs />, color: '#339933' },
        { name: 'Tailwind CSS', icon: <SiTailwindcss />, color: '#06B6D4' },
        { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248' },
        { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#4169E1' },
        { name: 'Docker', icon: <SiDocker />, color: '#2496ED' },
    ];

    const achievements = [
        { title: 'Kivu Stream', description: 'Plateforme de streaming sportif avec scores en direct et statistiques avancées', year: '2025' },
        { title: 'Architecture Scalable', description: 'Conception et déploiement d\'applications supportant des milliers d\'utilisateurs simultanés', year: '2024' },
        { title: 'Optimisation SEO', description: 'Implémentation de stratégies SEO avancées avec Schema.org et métadonnées dynamiques', year: '2025' },
        { title: 'API Integration', description: 'Intégration fluide de multiples APIs tierces (API-Football, streaming services)', year: '2024' },
    ];

    return (
        <div className="max-w-[1200px] mx-auto py-12 px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-4">
                    PREVUE <span className="text-accent-cyan">ARCHIMEDE</span>
                </h1>
                <p className="text-xl text-secondary mb-2">Développeur Full-Stack</p>
                <p className="text-accent-cyan font-semibold">Architecte de Solutions Web Modernes</p>
            </div>

            {/* Profile Section */}
            <div className="grid md:grid-cols-5 gap-8 mb-16">
                {/* Avatar */}
                <div className="md:col-span-2">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan to-blue-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-6 overflow-hidden">
                            <Image
                                src="/assets/images/prevue.jpg"
                                alt="Prevue Archimede"
                                width={400}
                                height={400}
                                className="rounded-xl w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4 mt-6 justify-center">
                        <SocialButton href="https://github.com/albatech22" icon={<FaGithub />} label="GitHub" />
                        <SocialButton href="https://www.linkedin.com/in/prevue-archimede-95b3ba1ba/" icon={<FaLinkedin />} label="LinkedIn" />
                    </div>
                </div>

                {/* Bio */}
                <div className="md:col-span-3 space-y-6">
                    <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="w-1 h-8 bg-accent-cyan rounded-full"></span>
                            À Propos
                        </h2>
                        <div className="space-y-4 text-secondary leading-relaxed">
                            <p>
                                Passionné par le développement web et les technologies modernes, je suis un <span className="text-white font-semibold">développeur full-stack</span> spécialisé dans la création d'applications web performantes et évolutives.
                            </p>
                            <p>
                                Avec une expertise approfondie en <span className="text-accent-cyan font-semibold">React, Next.js, Node.js et TypeScript</span>, je conçois des solutions digitales qui allient performance, esthétique et expérience utilisateur exceptionnelle.
                            </p>
                            <p>
                                <span className="text-white font-semibold">Kivu Stream</span> est le fruit de ma passion pour le football et le développement web. Cette plateforme démontre ma capacité à intégrer des APIs complexes, à optimiser les performances et à créer des interfaces utilisateur modernes et intuitives.
                            </p>
                            <p>
                                Mon approche du développement repose sur trois piliers : <span className="text-accent-cyan">code propre</span>, <span className="text-accent-cyan">architecture scalable</span> et <span className="text-accent-cyan">innovation continue</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="mb-16">
                <h2 className="text-3xl font-black text-white mb-8 text-center">
                    COMPÉTENCES <span className="text-accent-cyan">TECHNIQUES</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {skills.map((skill, index) => (
                        <div key={index} className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-xl p-6 hover:border-accent-cyan/30 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan text-2xl">
                                    {skill.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold">{skill.name}</h3>
                                    <p className="text-xs text-secondary">{skill.level}% Maîtrise</p>
                                </div>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-cyan to-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${skill.level}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-16">
                <h2 className="text-3xl font-black text-white mb-8 text-center">
                    STACK <span className="text-accent-cyan">TECHNOLOGIQUE</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {technologies.map((tech, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-xl p-6 hover:border-accent-cyan/30 transition-all duration-300 group hover:scale-105"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div
                                    className="text-5xl transition-transform duration-300 group-hover:scale-110"
                                    style={{ color: tech.color }}
                                >
                                    {tech.icon}
                                </div>
                                <span className="text-white font-semibold text-sm">{tech.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements */}
            <div className="mb-16">
                <h2 className="text-3xl font-black text-white mb-8 text-center">
                    RÉALISATIONS <span className="text-accent-cyan">CLÉS</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-xl p-6 hover:border-accent-cyan/30 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan font-black text-sm shrink-0">
                                    {achievement.year}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2 group-hover:text-accent-cyan transition-colors">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-secondary text-sm leading-relaxed">
                                        {achievement.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-accent-cyan/10 to-blue-500/10 border border-accent-cyan/20 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-black text-white mb-4">
                    Travaillons <span className="text-accent-cyan">Ensemble</span>
                </h2>
                <p className="text-secondary mb-8 max-w-[600px] mx-auto">
                    Vous avez un projet ambitieux ? Discutons de la façon dont je peux vous aider à le concrétiser avec des solutions web modernes et performantes.
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center gap-3 bg-[#00FFF7] text-black font-bold px-10 py-5 rounded-xl hover:bg-[#00d9e6] transition-all duration-300 hover:scale-105 shadow-xl shadow-[#00FFF7]/40 hover:shadow-[#00FFF7]/60 text-lg"
                >
                    Me Contacter
                </a>
            </div>
        </div>
    );
}

function SocialButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white hover:bg-[#00FFF7] hover:text-black hover:border-[#00FFF7] transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-[#00FFF7]/40 text-xl"
            aria-label={label}
        >
            {icon}
        </a>
    );
}
