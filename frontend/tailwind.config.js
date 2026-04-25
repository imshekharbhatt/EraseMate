/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", 'sans-serif'],
        serif: ["'Instrument Serif'", 'Georgia', 'serif'],
      },
      colors: {
        bg: '#f8f8fb',
        bg2: '#f2f1f8',
        line: '#e8e7f0',
        line2: '#d8d6ea',
        text: '#0f0e17',
        text2: '#3d3a52',
        muted: '#7c7a96',
        muted2: '#a8a6be',
        purple: {
          DEFAULT: '#5b3ff8',
          mid: '#7254fa',
          light: '#ede9fe',
          pale: '#f5f3ff',
          hover: '#4b32d4',
        },
      },
      boxShadow: {
        sm: '0 1px 3px rgba(15,14,23,0.06), 0 1px 2px rgba(15,14,23,0.04)',
        md: '0 4px 16px rgba(15,14,23,0.08), 0 2px 6px rgba(15,14,23,0.04)',
        lg: '0 16px 48px rgba(15,14,23,0.10), 0 4px 16px rgba(15,14,23,0.06)',
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
      keyframes: {
        rise: {
          'from': { opacity: '0', transform: 'translateY(18px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: { 'to': { transform: 'rotate(360deg)' } },
        pulseDot: {
          '0%,100%': { boxShadow: '0 0 0 3px rgba(91,63,248,0.18)' },
          '50%': { boxShadow: '0 0 0 6px rgba(91,63,248,0.08)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(80px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 0.6s ease forwards',
        spin: 'spin 0.85s linear infinite',
        pulseDot: 'pulseDot 1.2s ease-in-out infinite',
        slideUp: 'slideUp 0.35s cubic-bezier(.34,1.56,.64,1) forwards',
      },
    },
  },
  plugins: [],
}
