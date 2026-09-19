import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { brand: { DEFAULT: "#E6292D", dark: "#B31E22", light: "#FDECEC" }, ink: "#1F1F2E" }, fontFamily: { sans: ["Cairo", "Tahoma", "sans-serif"], cairo: ["Cairo", "sans-serif"] } } },
  plugins: [],
} satisfies Config;
