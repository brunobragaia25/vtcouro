import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C1810',
        secondary: '#D4A574',
        accent: '#E8D5C4',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        leather: {
          50: '#FAF7F4',
          100: '#F3EBE3',
          200: '#E8D5C4',
          300: '#D4A574',
          400: '#C08B52',
          500: '#A0703F',
          600: '#7A5230',
          700: '#573A22',
          800: '#3D2817',
          900: '#2C1810',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      maxWidth: {
        container: '1440px',
      },
      spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}

export default config
