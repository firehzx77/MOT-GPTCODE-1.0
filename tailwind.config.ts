import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        brand: {
          blue: '#0f172a'
        },
        explore: '#3b82f6',
        offer: '#ef4444',
        action: '#10b981',
        confirm: '#8b5cf6',
        tealPrimary: '#0e7381'
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config;
