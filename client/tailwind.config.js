/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A7BA7',
          dark: '#3A6B97',
          light: '#6B93BB',
        },
        secondary: {
          DEFAULT: '#8B4513',
          dark: '#6B3513',
          light: '#A0522D',
        },
        accent: {
          DEFAULT: '#E89B3C',
          dark: '#D88B2C',
          light: '#F5B563',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

