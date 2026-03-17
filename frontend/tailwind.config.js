/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        canvas: "#F4F7FB",
        mist: "#EEF4FB",
        accent: "#0F766E",
        ember: "#EA580C",
        gold: "#F59E0B",
        line: "#D9E4F1",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)",
        card: "0 24px 60px rgba(15, 23, 42, 0.12)",
      },
      fontFamily: {
        heading: ["'Sora'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
