import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-fast": "spin 350ms linear infinite",
      }
    },
  },
  plugins: [],
} satisfies Config;
