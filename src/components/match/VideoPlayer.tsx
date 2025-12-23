'use client';

import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type Hls from 'hls.js';

interface VideoPlayerProps {
    url?: string;
    title: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isHls, setIsHls] = useState(false);

    useEffect(() => {
        // Reset lock when URL changes
        setIsUnlocked(false);
        if (url?.endsWith('.m3u8')) {
            setIsHls(true);
            setIsUnlocked(true); // Auto-unlock for direct streams
        } else {
            setIsHls(false);
        }
    }, [url]);

    useEffect(() => {
        if (!isHls || !url || !videoRef.current) return;

        const video = videoRef.current;
        let hls: Hls | null = null;

        // Dynamic import to avoid SSR issues
        import('hls.js').then((HlsModule) => {
            const Hls = HlsModule.default;
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {
                        console.log('Autoplay prevented');
                    });
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari
                video.src = url;
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                });
            }
        });

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [url, isHls]);

    useEffect(() => {
        // Aggressive ad and popup blocking (The Iron Wall v2 - Simplified) for IFRAMES only
        if (typeof window !== 'undefined' && !isHls) {
            const noop = () => { };

            // 1. Global Freeze: Prevent automatic redirects
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                if (isUnlocked) {
                    e.preventDefault();
                    e.returnValue = '';
                    return '';
                }
            };
            window.addEventListener('beforeunload', handleBeforeUnload);

            // 2. Nuke window.open (Popups)
            const originalOpen = window.open;

            // Create a safe dummy object without circular references
            const dummyWindow = {
                closed: false,
                focus: noop,
                blur: noop,
                close: noop,
                // Simple location mock
                location: { href: 'about:blank', assign: noop, replace: noop, reload: noop },
                document: { write: noop, open: noop, close: noop },
            };

            // Safe Proxy to swallow property access
            const safeDummy = new Proxy(dummyWindow, {
                get: (target, prop) => {
                    if (prop in target) return (target as any)[prop];
                    return noop;
                }
            });

            window.open = function (...args: any[]) {
                console.log('🛡️ Blocked popup attempt (Silent)', args);
                return safeDummy as any;
            };

            // 3. Nuke Location Navigation (Redirects)
            const originalAssign = window.location.assign;
            const originalReplace = window.location.replace;
            const originalReload = window.location.reload;

            try {
                // Simple overrides without complex native masking for now
                Object.defineProperty(window.location, 'assign', {
                    value: function (url: string) {
                        console.log('🛡️ Blocked redirect to:', url);
                    },
                    writable: true,
                    configurable: true
                });

                Object.defineProperty(window.location, 'replace', {
                    value: function (url: string) {
                        console.log('🛡️ Blocked redirect to:', url);
                    },
                    writable: true,
                    configurable: true
                });

                Object.defineProperty(window.location, 'reload', {
                    value: function () {
                        console.log('🛡️ Blocked reload');
                    },
                    writable: true,
                    configurable: true
                });
            } catch (e) {
                console.error("Could not override location methods", e);
            }

            // 4. Block Alerts/Confirms
            const originalAlert = window.alert;
            const originalConfirm = window.confirm;
            window.alert = function () { return undefined; };
            window.confirm = function () { return false; };

            // 5. Iframe Interception
            if (iframeRef.current) {
                const iframe = iframeRef.current;
                const protectIframe = () => {
                    try {
                        const iframeWindow = iframe.contentWindow;
                        if (iframeWindow) {
                            // Basic protection
                            // iframeWindow.open = function() { return null; };
                        }
                    } catch (e) { }
                };
                iframe.addEventListener('load', protectIframe);
            }

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                window.open = originalOpen;
                window.alert = originalAlert;
                window.confirm = originalConfirm;
                try {
                    Object.defineProperty(window.location, 'assign', { value: originalAssign });
                    Object.defineProperty(window.location, 'replace', { value: originalReplace });
                    Object.defineProperty(window.location, 'reload', { value: originalReload });
                } catch (e) { }
            };
        }
    }, [url, isUnlocked, isHls]);

    const handleUnlock = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsUnlocked(true);
        console.log('✅ Lecteur déverrouillé');
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto">
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 ring-1 ring-white/5">
                {url ? (
                    <>
                        {isHls ? (
                            <video
                                ref={videoRef}
                                className="w-full h-full"
                                controls
                                crossOrigin="anonymous"
                                poster="/assets/images/video-placeholder.jpg" // You might want a dynamic poster
                            />
                        ) : (
                            <iframe
                                ref={iframeRef}
                                src={url}
                                className="w-full h-full"
                                allowFullScreen
                                allow="autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope"
                                referrerPolicy="origin"
                                title={title}
                                frameBorder="0"
                                scrolling="no"
                                loading="eager"
                            ></iframe>
                        )}

                        {/* Anti-redirect unlock screen (Only for Iframes) */}
                        {!isUnlocked && !isHls && (
                            <div className="absolute inset-0 z-50 bg-gradient-to-br from-black/95 via-zinc-900/95 to-black/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                                {/* Lock Icon */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-accent-cyan/30 rounded-full blur-2xl animate-pulse"></div>
                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border-2 border-accent-cyan/50 flex items-center justify-center">
                                        <Play className="w-10 h-10 text-accent-cyan fill-accent-cyan" />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="text-center max-w-md px-4">
                                    <h3 className="text-xl font-bold text-white mb-2">🛡️ Protection Anti-Publicité</h3>
                                    <p className="text-sm text-secondary mb-6">
                                        Pour éviter les redirections publicitaires, cliquez sur le bouton ci-dessous pour déverrouiller le lecteur.
                                    </p>

                                    {/* Unlock Button */}
                                    <button
                                        onClick={handleUnlock}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-bold text-white text-sm uppercase tracking-wider shadow-xl shadow-accent-cyan/30 hover:shadow-2xl hover:shadow-accent-cyan/50 transition-all duration-300 hover:scale-105"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Play className="w-5 h-5 fill-white" />
                                            Déverrouiller le Lecteur
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>
                                </div>

                                {/* Info Text */}
                                <p className="text-xs text-white/30 max-w-xs text-center px-4">
                                    Cette protection empêche les double-clics accidentels qui ouvrent des publicités
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6 text-center">
                        {/* Animated Background */}
                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl animate-pulse delay-75"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 max-w-md">
                            {/* Icon */}
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-white/10 flex items-center justify-center mb-6 relative group">
                                <div className="absolute inset-0 bg-accent-cyan/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                                <Play className="w-12 h-12 text-accent-cyan relative z-10" />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Chargement du flux...</h3>

                            {/* Description */}
                            <p className="text-secondary mb-6 text-sm leading-relaxed">
                                La diffusion commence quelques minutes avant le coup d'envoi. Restez connecté pour ne rien manquer.
                            </p>

                            {/* Loading Bar */}
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full animate-pulse" style={{ width: '60%' }}></div>
                            </div>

                            {/* Status Text */}
                            <p className="text-xs text-white/30 font-mono">En attente du signal...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
