/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-teal": "#14b8a6",
        "neon-aqua": "#22d3ee",
        "neon-purple": "#9333ea",
        "neon-pink": "#ec4899",
        "glass-dark": "rgba(20,24,31,0.85)",
        "glass-black": "rgba(10,12,18,0.92)",
      },
      boxShadow: {
        "neon-teal":
          "0 0 16px 2px #14b8a6, 0 0 32px 8px #22d3ee",
        "neon-purple":
          "0 0 16px 2px #9333ea, 0 0 32px 8px #ec4899",
        "neon-pink":
          "0 0 16px 2px #ec4899, 0 0 32px 8px #9333ea",
        glass:
          "0 4px 32px 0 rgba(20,184,166,0.12), 0 1.5px 8px 0 rgba(147,51,234,0.10)",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(147,51,234,0.10) 100%)",
        "radial-glow":
          "radial-gradient(circle, rgba(20,184,166,0.10) 0%, rgba(34,211,238,0.08) 60%, transparent 100%)",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        number: ["Inter", "sans-serif"],
      },
      transitionTimingFunction: {
        "in-out-cubic": "cubic-bezier(0.77,0,0.175,1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        lift: {
          "0%": { transform: "translateY(0) scale(1)" },
          "100%": { transform: "translateY(-8px) scale(1.03)" },
        },
        press: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.96)" },
        },
        countup: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        lift: "lift 0.3s cubic-bezier(0.77,0,0.175,1) forwards",
        press: "press 0.15s cubic-bezier(0.77,0,0.175,1) forwards",
        countup: "countup 0.8s ease-out",
      },
    },
  },
  plugins: [],
};
