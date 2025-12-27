'use client';

import { useState } from 'react';
import { Calendar, Clock, Tv, Star, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const programs = [
    {
        time: '09:00',
        duration: '60 min',
        title: 'Téléfoot : L\'actu du foot',
        channel: 'TF1',
        category: 'Magazine',
        isLive: false,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop'
    },
    {
        time: '13:00',
        duration: '120 min',
        title: 'Premier League Weekly',
        channel: 'Canal+',
        category: 'Sport',
        isLive: false,
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=225&fit=crop'
    },
    {
        time: '18:30',
        duration: '90 min',
        title: 'Sénégal vs Botswana',
        channel: 'beIN Sports 1',
        category: 'Match en direct',
        isLive: true,
        image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=225&fit=crop'
    },
    {
        time: '20:45',
        duration: '105 min',
        title: 'Arsenal vs Crystal Palace',
        channel: 'Canal+ Foot',
        category: 'Match en direct',
        isLive: true,
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&h=225&fit=crop'
    },
    {
        time: '23:00',
        duration: '45 min',
        title: 'Champions League Highlights',
        channel: 'RMC Sport 1',
        category: 'Highlights',
        isLive: false,
        image: 'https://images.unsplash.com/photo-1579952318536-60844781600c?w=400&h=225&fit=crop'
    }
];

const days = [
    { label: 'Aujourd\'hui', active: true },
    { label: 'Mer 24 Déc', active: false },
    { label: 'Jeu 25 Déc', active: false },
    { label: 'Ven 26 Déc', active: false },
    { label: 'Sam 27 Déc', active: false },
];

export default function TVPage() {
    return (
        <main className="min-h-screen bg-[#050505] pb-20">
            {/* Background Ambient Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-blue/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-8">
                {/* Header Section */}
                <div className="flex flex-col gap-2 mb-10">
                    <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                        <span className="font-bold">Kivu Stream</span>
                        <span className="text-white/10">/</span>
                        <span>Programme TV Sports</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        PROGRAMME <span className="text-accent-blue">TV</span>
                    </h1>
                </div>

                {/* Day Selector */}
                <div className="flex items-center gap-2 mb-12 overflow-x-auto no-scrollbar pb-2">
                    {days.map((day) => (
                        <button
                            key={day.label}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${day.active ? 'bg-accent-blue text-white shadow-[0_0_20px_rgba(10,132,255,0.2)]' : 'bg-[#121212] text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            {day.label}
                        </button>
                    ))}
                    <button className="ml-auto p-2.5 bg-[#121212] rounded-xl text-white/40 hover:text-white transition-colors">
                        <Calendar className="w-5 h-5" />
                    </button>
                </div>

                {/* Schedule List */}
                <div className="flex flex-col gap-4">
                    {programs.map((program, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx}
                            className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center p-4 gap-6">
                                {/* Time Column */}
                                <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-white/5 pr-6">
                                    <span className={`text-2xl font-black italic ${program.isLive ? 'text-red-500' : 'text-white'}`}>
                                        {program.time}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">
                                        {program.duration}
                                    </span>
                                </div>

                                {/* Content Info */}
                                <div className="flex-1 flex gap-4">
                                    <div className="w-24 h-16 rounded-xl overflow-hidden hidden sm:block grayscale group-hover:grayscale-0 transition-all">
                                        <img src={program.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            {program.isLive && (
                                                <span className="flex h-2 w-2 relative">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                            )}
                                            <span className="text-[10px] font-black text-accent-blue uppercase tracking-widest">{program.category}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-accent-blue transition-colors">{program.title}</h3>
                                        <div className="flex items-center gap-2 text-white/30 text-xs font-semibold">
                                            <Tv className="w-3 h-3" />
                                            {program.channel}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4 ml-auto">
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-accent-gold transition-all">
                                        <Star className="w-5 h-5" />
                                    </button>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white text-white hover:text-black font-black uppercase text-xs rounded-xl transition-all">
                                        Regarder
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
