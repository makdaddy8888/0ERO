import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ground: {
          DEFAULT: "#0a0a0f",
          50: "#18181f",
          100: "#1f1f28",
          200: "#2a2a36",
          300: "#3f3f4f",
          400: "#52526a",
          500: "#71718a",
        },
        agent: {
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
        },
        "agent-pink": {
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
        },
      },
      backgroundImage: {
        "agent-gradient":
          "linear-gradient(135deg, #7c3aed 0%, #9333ea 45%, #ec4899 100%)",
        "agent-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.35), transparent), radial-gradient(ellipse 60% 50% at 90% 20%, rgba(236,72,153,0.2), transparent)",
        "agent-btn":
          "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(236,72,153,0.15) 100%)",
      },
      boxShadow: {
        agent: "0 0 24px -4px rgba(139, 92, 246, 0.4)",
        "agent-pink": "0 0 32px -4px rgba(236, 72, 153, 0.35)",
        "agent-lg": "0 4px 40px -8px rgba(124, 58, 237, 0.5), 0 0 60px -20px rgba(236, 72, 153, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
