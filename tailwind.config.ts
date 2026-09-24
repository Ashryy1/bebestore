import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Aref Ruqaa', 'sans-serif'],
                ruqaa: ['"Aref Ruqaa"', 'cursive', 'serif'],
                caveat: ['Caveat', 'cursive'],
            },
            colors: {
                brand: {
                    50: '#fdfaff', 100: '#f9f5ff', 200: '#f0e6ff', 300: '#e1ccff',
                    400: '#c4b5fd', 500: '#9c83f9', 600: '#8a72e8', 700: '#7367f0',
                    800: '#5b52c9', 900: '#4a42a3', 950: '#2d296b',
                },
                warm: {
                    50: '#fff9eb',
                    100: '#ffefc6',
                    200: '#ffd08a',
                    300: '#ffb14e',
                    400: '#ff8c1a',
                    500: '#f56a00',
                    600: '#d14d00',
                    700: '#a33b00',
                    800: '#803000',
                    900: '#662700',
                    950: '#3d1400',
                }
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'shimmer': 'shimmer 2s infinite linear',
                'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'mesh': "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)",
            }
        },
    },
    plugins: [],
};

export default config;

