/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5B21B6',
          hover: '#7C3AED',
          deep: '#4C1D95',
          light: '#F3E8FF',
          accent: '#F59E0B',
          cream: '#FFF7ED',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E5E7EB',
          textPrimary: '#111827',
          textSecondary: '#64748B',
        },
        status: {
          success: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'default': '18px',
        'card': '22px',
        'button': '14px',
        'input': '14px',
        'subcard': '18px',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(53, 19, 95, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 20px 40px -10px rgba(53, 19, 95, 0.08), 0 8px 10px -4px rgba(0, 0, 0, 0.03)',
        'purple-glow': '0 10px 25px -3px rgba(79, 29, 149, 0.25)',
        'orange-glow': '0 10px 25px -3px rgba(245, 158, 11, 0.3)',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #35135F 0%, #4F1D95 100%)',
        'purple-accent-gradient': 'linear-gradient(135deg, #35135F 0%, #6B21A8 50%, #4F1D95 100%)',
        'orange-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      }
    },
  },
  plugins: [],
}
