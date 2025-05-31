// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F1FAEE',
        foreground: '#2D3142',
        primary: '#1D3557',
        accent: '#457B9D',
        pending: '#E9C46A',
        inprogress: '#F4A261',
        resolved: '#2A9D8F',
        critical: '#E76F51',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};