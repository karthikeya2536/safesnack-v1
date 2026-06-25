import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171916",
        canvas: "#FCFDF9",
        paper: "#FCFDF9",
        cream: "#FCFDF9",
        sand: "#626861",
        clay: "#E83E62",
        terracotta: "#C9284B",
        sage: "#DDE2DC",
        bone: "#F4F6F3",
        charcoal: "#171916",
        forest: "#171916",
      },
      fontFamily: {
        serif: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
