/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // indigo-600
        secondary: "#0EA5E9", // sky-500
        success: "#10B981", // emerald-500
        warning: "#F59E0B", // amber-500
        danger: "#EF4444", // red-500
        background: "#F8FAFC", // light gray
        sidebar: "#1E1B4B", // deep indigo
        slate: {
          900: "#0F172A",
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
