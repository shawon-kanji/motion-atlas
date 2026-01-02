/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#0c1a24',
          100: '#0f2535',
          200: '#164059',
          300: '#1e5a7d',
          400: '#2980a9',
          500: '#38bdf8',
          600: '#5ccbfa',
          700: '#7dd3fc',
          800: '#a5e0fd',
          900: '#ceeffe',
          950: '#e8f7ff',
        },
        gray: {
          50: '#030712',
          100: '#0a0f1a',
          200: '#111827',
          300: '#1f2937',
          400: '#374151',
          500: '#4b5563',
          600: '#6b7280',
          700: '#9ca3af',
          800: '#d1d5db',
          900: '#e5e7eb',
          950: '#f9fafb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
