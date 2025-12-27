'use client';

import MatchFeed from '@/components/home/MatchFeed';

export default function LivePage() {
    return (
        <main className="min-h-screen bg-[#050505]">
            {/* Background Ambient Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="pt-2">
                <MatchFeed mode="live" />
            </div>
        </main>
    );
}
