'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User } from 'lucide-react'

interface Message {
    id: string;
    user: string;
    text: string;
    isSystem?: boolean;
}

export default function LiveChat() {
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', user: 'Système', text: 'Bienvenue sur le chat en direct ! Soyez respectueux.', isSystem: true },
        { id: '2', user: 'Fan123', text: 'Quel match pour le moment !' },
        { id: '3', user: 'SportLvr', text: 'Des pronostics pour la 2ème mi-temps ?' },
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (!mounted) return (
        <div className="flex flex-col h-full bg-surface rounded-2xl border border-white/5 overflow-hidden min-h-[400px]">
            <div className="p-4 border-b border-white/5 bg-white/5">
                <div className="h-4 w-32 bg-white/5 animate-pulse rounded"></div>
            </div>
            <div className="flex-1 p-4 space-y-4">
                <div className="h-10 w-3/4 bg-white/5 animate-pulse rounded-xl"></div>
                <div className="h-10 w-1/2 bg-white/5 animate-pulse rounded-xl"></div>
            </div>
        </div>
    );

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            user: 'Vous', // In real app, auth user
            text: input.trim()
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');

        // Simulate random incoming message
        if (Math.random() > 0.7) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    user: `Utilisateur${Math.floor(Math.random() * 1000)}`,
                    text: ['Allez l\'équipe !', 'Incroyable !', 'L\'arbitre est aveugle !', 'Joli jeu !'][Math.floor(Math.random() * 4)]
                }]);
            }, 2000 + Math.random() * 3000);
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-live animate-pulse"></span>
                    Chat en Direct
                </h3>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex flex-col ${msg.user === 'Vous' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`text-[10px] mb-1 ${msg.isSystem ? 'text-accent font-bold' : 'text-secondary'}`}>
                                {msg.user}
                            </div>
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.isSystem ? 'bg-accent/10 text-accent w-full text-center border border-accent/20' :
                                msg.user === 'Vous' ? 'bg-accent text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-black/20 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écrivez un message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-gray-600"
                />
                <button
                    type="submit"
                    className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!input.trim()}
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}
