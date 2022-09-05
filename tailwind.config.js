/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          100: 'rgb(248,249,249)',
          200: 'rgb(227,229,232)',
          300: 'rgb(199,204,209)',
          400: 'rgb(144,153,164)',
          500: 'rgb(116,127,141)',
          600: 'rgb(79,86,96)',
          700: 'rgb(46,51,56)',
          800: 'rgb(35,38,42)',
          900: 'rgb(6,6,7)'
        },
        dark: {
          100: 'rgb(246,246,247)',
          200: 'rgb(220,221,222)',
          300: 'rgb(185,187,190)',
          400: 'rgb(114,118,125)',
          500: 'rgb(79,84,92)',
          600: 'rgb(54,57,63)',
          700: 'rgb(32,34,37)',
          800: 'rgb(24,25,28)',
          900: 'rgb(4,5,6)'
        },
      },
    },
    plugins: [],
  }
}
