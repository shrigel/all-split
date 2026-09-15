/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5B8FB9',
        'primary-hover': '#4d7ca2',
        'primary-container': '#4479a2',
        'on-primary': '#ffffff',
        'on-primary-container': '#fcfcff',
        'secondary': '#2f647d',
        'secondary-container': '#ade1fd',
        'on-secondary': '#ffffff',
        'surface': '#f9f9ff',
        'surface-dim': '#cfdaf2',
        'surface-bright': '#f9f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f3ff',
        'surface-container': '#e7eeff',
        'surface-container-high': '#dee8ff',
        'surface-container-highest': '#d8e3fb',
        'surface-variant': '#d8e3fb',
        'on-surface': '#111c2d',
        'on-surface-variant': '#41474e',
        'outline': '#71787f',
        'outline-variant': '#c1c7cf',
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        'background': '#f9f9ff',
        'on-background': '#111c2d',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      maxWidth: {
        'app': '680px',
      }
    },
  },
  plugins: [],
};
