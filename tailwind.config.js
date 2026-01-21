/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E53935",    // Sindoor Red
        secondary: "#FBC02D",  // Sacred Gold
        navy: "#0A2540",
        soft: "#FFF5F5",
      },
    },
  },
  plugins: [],
};
