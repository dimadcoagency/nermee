/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/contexts/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        nermee: {
          green: '#00B14F',
          dark: '#003D1A',
          light: '#E6F9EE',
          white: '#FFFFFF',
          surface: '#F5F5F5',
          border: '#E0E0E0',
          text: '#111111',
          'text-sec': '#888888',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        app: '430px',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
