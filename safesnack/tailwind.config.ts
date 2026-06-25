import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "#FAF8F3",
        charcoal: "#1C1B17",
        forest: "#2F3D2E",
        sage: "#E7EADF",
        clay: "#B5704D",
      },
      transitionDuration: { DEFAULT: "300ms" },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Newsreader", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
