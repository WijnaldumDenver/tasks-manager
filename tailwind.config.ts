import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#EBFFEB",
          100: "#DBFFDC",
          200: "#B8FFB9",
          300: "#94FF96",
          400: "#6BFF6E",
          500: "#47FF4A",
          600: "#24FF27",
          700: "#00FF04",
          800: "#00A803",
          900: "#005701",
          950: "#002901",
        },
      },
    },
  },
  plugins: [],
};
export default config;
