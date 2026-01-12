/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // TurkEats Brand (Uber Eats exact green)
        'turkeats': {
          green: '#06C167',      // Primary green (launch screen, CTAs)
          'green-dark': '#05A85A', // Darker hover state
        },
        // Uber Eats exact color palette
        'uber': {
          green: '#06C167',      // Primary
          black: '#000000',      // Text, active tabs
          'gray-900': '#1F2937', // Dark text
          'gray-700': '#374151', // Body text
          'gray-500': '#6B7280', // Subtitle, inactive
          'gray-400': '#9CA3AF', // Placeholder
          'gray-200': '#E5E7EB', // Borders
          'gray-100': '#F3F4F6', // Search bg, cards
          'gray-50': '#F9FAFB',  // Light backgrounds
          white: '#FFFFFF',
        },
        // UI Elements
        'badge': {
          green: '#10B981',      // "most liked" badges
          orange: '#F59E0B',     // Promotions
          red: '#EF4444',        // Errors, alerts
        },
        'rating': {
          star: '#FFD700',       // Gold star
        },
      },
      fontFamily: {
        // iOS system font stack (matches Uber Eats)
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        // Exact Uber Eats typography scale
        'display': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'title-xl': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'title-lg': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'title-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'title-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'caption': ['10px', { lineHeight: '14px', fontWeight: '500' }],
      },
      spacing: {
        // Uber Eats spacing scale
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'modal': '0 10px 25px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
