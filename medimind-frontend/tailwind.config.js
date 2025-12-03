/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981", // Green
        secondary: "#1f2937", // Dark Gray
        dark: "#0f172a", // Navy Blue (Background)
        card: "#1e293b", // Lighter Navy (Cards)
        text: "#f8fafc", // White/Light Gray
      },
    },
  },
  plugins: [],
}
