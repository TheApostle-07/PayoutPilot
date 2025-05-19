/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // the “./” makes it explicit that these globs are relative
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
};