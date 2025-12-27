'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface DateSelectorProps {
    selectedDate?: Date;
    onDateChange?: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [dates, setDates] = useState<Array<{ date: Date; label: string; num: string; isToday: boolean }>>([]);
    const [mounted, setMounted] = useState(false);

    const generateDates = (centerDate: Date) => {
        const dateArray = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Generate 5 dates: 2 before, center (today), 2 after
        for (let i = -2; i <= 2; i++) {
            const date = new Date(centerDate);
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const isToday = date.getTime() === today.getTime();

            dateArray.push({
                date: date,
                label: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
                num: date.getDate().toString(),
                isToday: isToday
            });
        }

        setDates(dateArray);
    };

    useEffect(() => {
        setMounted(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to local midnight
        setCurrentDate(today);
        generateDates(today);
    }, []);

    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
        generateDates(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
        generateDates(newDate);
    };

    const handleDateClick = (date: Date) => {
        setCurrentDate(date);
        if (onDateChange) {
            onDateChange(date);
        }
    };

    const handleTodayClick = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setCurrentDate(today);
        if (onDateChange) {
            onDateChange(today);
        }
    };

    // Generate a fresh copy of the selected date at start of day for comparison
    const selected = new Date(selectedDate || currentDate);
    selected.setHours(0, 0, 0, 0);

    // Prevent hydration mismatch by not rendering dates until mounted
    if (!mounted || dates.length === 0) {
        return (
            <div className="bg-[#1a1a1a] border-b border-white/5 py-3 px-4 flex items-center justify-between">
                <button className="text-white/20">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6 px-2">
                    <div className="flex items-center gap-2.5 px-5 py-2.5 bg-[#121212] border border-white/10 rounded-xl">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span className="text-[13px] font-bold text-white">Chargement...</span>
                    </div>
                </div>
                <button className="text-white/20">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] border-b border-white/5 py-3 px-4 flex items-center justify-between">
            <button
                onClick={handlePrevious}
                className="text-white/20 hover:text-white transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2">
                {dates.slice(0, 2).map((dateInfo, idx) => {
                    const isSelected = dateInfo.date.getTime() === selected.getTime();
                    return (
                        <button
                            key={idx}
                            onClick={() => handleDateClick(dateInfo.date)}
                            className={`flex flex-col items-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                                }`}
                        >
                            <span className="text-[11px] font-bold tracking-tight text-white mb-0.5 capitalize">
                                {dateInfo.label}
                            </span>
                            <span className="text-sm font-black text-white">{dateInfo.num}</span>
                        </button>
                    );
                })}

                <button
                    onClick={handleTodayClick}
                    className="flex items-center gap-2.5 px-5 py-2.5 bg-[#121212] border border-white/10 rounded-xl shadow-lg ring-1 ring-white/5 mx-2 hover:border-accent-cyan/50 transition-colors"
                >
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-[13px] font-bold text-white whitespace-nowrap">Aujourd'hui</span>
                </button>

                {dates.slice(3).map((dateInfo, idx) => {
                    const isSelected = dateInfo.date.getTime() === selected.getTime();
                    return (
                        <button
                            key={idx}
                            onClick={() => handleDateClick(dateInfo.date)}
                            className={`flex flex-col items-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                                }`}
                        >
                            <span className="text-[11px] font-bold tracking-tight text-white mb-0.5 capitalize">
                                {dateInfo.label}
                            </span>
                            <span className="text-sm font-black text-white">{dateInfo.num}</span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={handleNext}
                className="text-white/20 hover:text-white transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
