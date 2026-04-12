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
        nearmee: {
          coral:       '#FF5757',
          'coral-dark':'#E84E4E',
          'coral-deep':'#9A2E2E',
          light:       '#FFF0F0',
          white:       '#FFFFFF',
          surface:     '#F7F7F7',
          border:      '#EEEEEE',
          text:        '#111111',
          'text-sec':  '#888888',
          dark:        '#2D2D2D',
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
