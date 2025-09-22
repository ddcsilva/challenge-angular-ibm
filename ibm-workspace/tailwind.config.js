/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/angular-challenge/src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        // Paleta de cores principal - tons de azul
        portal: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Cor base principal
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // Paleta secundária - tons de verde
        science: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Cor base secundária
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },

        // Paleta para alertas e erros
        alert: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Cor base para alertas
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },

      fontFamily: {
        sans: ['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },

      // Espaçamentos customizados para layouts específicos
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
    },
  },
  plugins: [],

  // Desabilita o reset padrão do Tailwind para evitar conflitos com Angular Material
  corePlugins: {
    preflight: false,
  },
};
