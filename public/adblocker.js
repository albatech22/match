// Advanced Client-Side Ad Blocker
// This script runs in the browser to aggressively block ads

(function () {
    'use strict';

    // Block all popups and new windows
    const originalWindowOpen = window.open;
    window.open = function () {
        console.log('🚫 Popup blocked by anti-ad script');
        return null;
    };

    // Block annoying alerts and confirms
    window.alert = function () { };
    window.confirm = function () { return false; };

    // Detect and remove ad iframes
    function removeAdIframes() {
        const adPatterns = [
            'doubleclick',
            'googlesyndication',
            'googleadservices',
            '/ads/',
            'adserver',
            'advertising',
            'ad-delivery',
            'ad.doubleclick',
            'pubads',
            'adservice'
        ];

        document.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.src || '';
            const isAd = adPatterns.some(pattern => src.includes(pattern));
            if (isAd) {
                iframe.remove();
                console.log('🚫 Removed ad iframe:', src);
            }
        });
    }

    // Remove ad-related elements
    function removeAdElements() {
        const adSelectors = [
            '[id*="ad-"]',
            '[id*="ads-"]',
            '[class*="advertisement"]',
            '[class*="ad-container"]',
            '[class*="ad_container"]',
            '[data-ad]',
            '[data-ads]',
            '.popup-overlay',
            '.ad-overlay'
        ];

        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Only remove if it's not the video player itself
                if (!el.closest('.video-player') && !el.querySelector('video')) {
                    el.remove();
                }
            });
        });
    }

    // Block script injection
    function blockAdScripts() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'SCRIPT') {
                        const src = node.src || '';
                        const adPatterns = [
                            'doubleclick',
                            'googlesyndication',
                            '/ads/',
                            'adserver',
                            'advertising'
                        ];

                        if (adPatterns.some(pattern => src.includes(pattern))) {
                            node.remove();
                            console.log('🚫 Blocked ad script:', src);
                        }
                    }

                    // Also check for ad iframes
                    if (node.tagName === 'IFRAME') {
                        const src = node.src || '';
                        const adPatterns = ['doubleclick', 'googlesyndication', '/ads/'];
                        if (adPatterns.some(pattern => src.includes(pattern))) {
                            node.remove();
                            console.log('🚫 Blocked ad iframe:', src);
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Prevent ad overlays
    function preventOverlays() {
        // Remove body overflow hidden (anti-adblock trick)
        if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = '';
        }

        // Remove high z-index overlays (often ads)
        document.querySelectorAll('div').forEach(div => {
            const zIndex = parseInt(window.getComputedStyle(div).zIndex);
            if (zIndex > 999999) {
                const rect = div.getBoundingClientRect();
                // If it covers most of the screen, it's likely an ad overlay
                if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.5) {
                    div.remove();
                    console.log('🚫 Removed ad overlay with z-index:', zIndex);
                }
            }
        });
    }

    // Run cleaners periodically
    function startCleaning() {
        removeAdIframes();
        removeAdElements();
        preventOverlays();

        // Run every 500ms to catch dynamically loaded ads
        setInterval(() => {
            removeAdIframes();
            removeAdElements();
            preventOverlays();
        }, 500);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            startCleaning();
            blockAdScripts();
        });
    } else {
        startCleaning();
        blockAdScripts();
    }

    console.log('✅ Ad blocker initialized');
})();
