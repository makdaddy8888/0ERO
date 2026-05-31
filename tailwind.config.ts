import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          600: "#16a34a",
          800: "#166534",
        },
      },
    },
  },
  plugins: [],
};

export default config;
