/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true
      },
      fontFamily: {
        inter: ["'Inter'", 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen sm': { maxWidth: '520px' },
          '@screen md': { maxWidth: '640px' },
          '@screen lg': { maxWidth: '768px' }
        }
      })
    }
  ]
}
