/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(55 65 81)',
            lineHeight: '1.7',
            '> *': {
              gridColumn: '1 / -1',
            },
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
              marginBottom: '1rem',
              color: 'rgb(17 24 39)',
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.875rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              color: 'rgb(17 24 39)',
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              color: 'rgb(17 24 39)',
            },
            'h4, h5, h6': {
              fontWeight: '600',
              color: 'rgb(17 24 39)',
            },
            p: {
              marginBottom: '1.25rem',
            },
            a: {
              color: 'rgb(59 130 246)',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: 'rgb(37 99 235)',
                textDecoration: 'underline',
              },
            },
            'ul, ol': {
              marginBottom: '1.25rem',
              paddingLeft: '1.5rem',
            },
            li: {
              marginBottom: '0.5rem',
            },
            blockquote: {
              borderLeft: '4px solid rgb(229 231 235)',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              color: 'rgb(75 85 99)',
              marginBottom: '1.25rem',
            },
            code: {
              color: 'rgb(239 68 68)',
              backgroundColor: 'rgb(249 250 251)',
              paddingTop: '0.25rem',
              paddingBottom: '0.25rem',
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
            },
            pre: {
              backgroundColor: 'rgb(31 41 55)',
              color: 'rgb(229 231 235)',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              marginBottom: '1.25rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Line clamp utility
    function({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.line-clamp-4': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
        },
      }
      addUtilities(newUtilities, ['responsive'])
    },
    // Custom scrollbar utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgb(243 244 246)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(156 163 175)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgb(107 114 128)',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
