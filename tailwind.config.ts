import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-main)",
                foreground: "var(--text-primary)",

                // Custom Palette
                main: "#0D0D0D",
                surface: "#1A1A1A",
                card: "#222222",

                primary: "#E5E5E5",
                secondary: "#A3A3A3",
                tertiary: "#525252",

                accent: {
                    DEFAULT: "#7F5AF0", // Violet
                    cyan: "#00FFF7",    // Cyan
                    glow: "rgba(127, 90, 240, 0.5)",
                },

                status: {
                    live: "#FF4D4D",
                    upcoming: "#FFD700",
                    finished: "#888888",
                }
            },
            fontFamily: {
                heading: ["var(--font-heading)", "sans-serif"],
                body: ["var(--font-body)", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "glow": "glow 2s ease-in-out infinite alternate",
            },
            keyframes: {
                glow: {
                    "0%": { boxShadow: "0 0 5px rgba(127, 90, 240, 0.2)" },
                    "100%": { boxShadow: "0 0 20px rgba(127, 90, 240, 0.6), 0 0 10px rgba(0, 255, 247, 0.4)" },
                }
            }
        },
    },
    plugins: [],
};
export default config;
