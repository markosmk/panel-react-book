/** @type {import('tailwindcss').Config} */
// import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';
// import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        'gray-main': 'hsl(var(--gray-main))',
        'gray-hover': 'hsl(var(--gray-hover))',
        'gray-active': 'hsl(var(--gray-active))',
        'gray-extra-light': 'hsl(var(--gray-extra-light))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          50: '#ecfdf5',
          100: '#d2f9e4',
          200: '#a9f1ce',
          300: '#71e4b3',
          400: '#38cf95',
          500: '#14b57c',
          600: '#089365',
          700: '#077554',
          800: '#085d43',
          900: '#084c38',
          950: '#032b20',
          DEFAULT: '#14b57c'
        },
        // primary: {
        //   DEFAULT: 'hsl(var(--primary))',
        //   foreground: 'hsl(var(--primary-foreground))'
        // },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(2rem)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'scale-in':
          'scale-in var(--tw-animate-duration, 0.2s) var(--tw-animate-easing, ease) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, 1) var(--tw-animate-fill, both)',
        'fade-left':
          'fade-left var(--tw-animate-duration, 0.2s) var(--tw-animate-easing, ease) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, 1) var(--tw-animate-fill, both)'
      },
      animationTimingFunction: {
        DEFAULT: 'ease',
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      animationIteration: {
        1: '1',
        2: '2',
        3: '3',
        infinite: 'infinite',
        once: '1',
        twice: '2',
        thrice: '3'
      }
    }
  },
  plugins: [animate]
  // plugins: [
  //   animate,
  //   plugin(function ({ addUtilities }) {
  //     addUtilities({
  //       '.animate-once': {
  //         '--tw-animate-iteration': '1',
  //         'animation-iteration-count': 'var(--tw-animate-iteration)'
  //       }
  //     });
  //   })
  // ]
};
