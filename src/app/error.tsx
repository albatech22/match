'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled Client Exception:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            {/* Ambient Glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-md w-full">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mb-8 relative group">
                    <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <AlertTriangle className="w-10 h-10 text-red-500 relative z-10" />
                </div>

                {/* Text */}
                <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Oups ! <br />Quelque chose s&apos;est mal passé.</h1>
                <p className="text-white/40 mb-10 text-sm leading-relaxed">
                    Une erreur inattendue est survenue dans l&apos;application. Ne vous inquiétez pas, nous avons été notifiés.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/10"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Réessayer
                    </button>

                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        Retour à l'accueil
                    </Link>
                </div>

                {/* Error Details (Hidden in Prod usually, but helpful for debug for now) */}
                <div className="mt-12 pt-12 border-t border-white/5">
                    <p className="text-[10px] font-mono text-white/10 uppercase tracking-widest mb-2">Erreur technique</p>
                    <p className="text-[10px] font-mono text-white/20 break-all bg-white/5 p-3 rounded-lg border border-white/5">
                        {error.message || "Exception client-side inconnue"}
                        {error.digest && <span className="block mt-1 opacity-50">ID: {error.digest}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}
