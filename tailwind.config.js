/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          hover: '#357ABD',
          light: '#B6D9FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F7FA',
        },
        text: {
          DEFAULT: '#4A4A4A',
          secondary: '#718096',
        },
        border: '#E5E9F2',
        success: '#4CAF50',
        error: '#FF6B6B',
      }
    }
  },
  plugins: [],
}
