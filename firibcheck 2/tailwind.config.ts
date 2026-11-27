import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { xl: "1232px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#111827", soft: "#6B7280", faint: "#9CA3AF" },
        surface: { DEFAULT: "#FFFFFF", 2: "#F7F8FA" },
        line: "#E5E7EB",
        brand: { DEFAULT: "#2563EB", soft: "#EFF6FF", deep: "#1D4ED8", sky: "#3B9EFF" },
        ok: { DEFAULT: "#15803D", soft: "#ECFDF3" },
        warn: { DEFAULT: "#D97706", soft: "#FFF7E6" },
        danger: { DEFAULT: "#DC2626", soft: "#FEF2F2" },
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: { "4xl": "2rem" },
      boxShadow: {
        card: "0 2px 6px rgba(17,24,39,.04), 0 24px 48px -12px rgba(17,24,39,.08)",
        glass: "0 20px 40px -12px rgba(30,64,153,.14)",
        btn: "0 8px 20px -6px rgba(37,99,235,.45)",
      },
      keyframes: {
        shine: { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(220%)" } },
        scan: { "0%": { top: "0%" }, "50%": { top: "96%" }, "100%": { top: "0%" } },
      },
      animation: {
        shine: "shine 2.8s ease-in-out infinite",
        scan: "scan 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
