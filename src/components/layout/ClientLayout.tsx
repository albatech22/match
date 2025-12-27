'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import DesktopHeader from '@/components/layout/DesktopHeader';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Navbar from './Navbar';
import Footer from './Footer';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-[#050505] text-primary">
                {/* Desktop Navigation */}
                <Navbar />

                <div className="flex">
                    {/* Desktop Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <main className="flex-1 lg:ml-64">
                        {/* Mobile Header */}
                        <MobileHeader />

                        {/* Desktop Header */}
                        <DesktopHeader />

                        {/* Page Content */}
                        {children}

                        {/* Footer */}
                        <Footer />
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
            </div>
        </ThemeProvider>
    );
}
