/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        }
      },
      animation: {
        blob: "blob 7s infinite",
        "blob-delay-2000": "blob 7s infinite 2s",
        "blob-delay-4000": "blob 7s infinite 4s",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        fadeIn: "fadeIn 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
