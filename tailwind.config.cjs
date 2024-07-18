/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray

module.exports = {
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    extend: {},
    colors: {
      ...colors,
      dark: '#1c1c1c',
      primary: '#0cbc3d',
      warning: '#e6a23c',
      success: '#45b8db',
      danger: '#f56c6c',
      error: '#f56c6c',
      info: '#909399',
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
