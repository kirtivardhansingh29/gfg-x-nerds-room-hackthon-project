/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07111F",
        mist: "#EEF4FB",
        canvas: "#F6F8FC",
        accent: "#0F9D8D",
        ember: "#FF7A59",
        gold: "#F4B740",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(7, 17, 31, 0.12)",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
