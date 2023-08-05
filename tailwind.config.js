const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": {
            transform: "translateY(-30px)",
            opacity: "0.1",
          },
          "70%": {
            transform: "translateY(10px)",
          },
          "100%": {
            transform: "translateY(0px)",
            opacity: "1",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0.1",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      fontFamily: {
        spectral: ["Spectral SC", ...defaultTheme.fontFamily.serif],
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        slide: "slide 0.2s ease-in-out 1",
        fadeIn: "fadeIn 1s ease-in-out 1",
        fadeInFast: "fadeIn 0.5s ease-out 1",
      },
    },
  },
  plugins: [],
};
