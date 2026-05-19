import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Tailwind theme.
 *
 * Brand tokens are defined as CSS custom properties in `src/app/globals.css`
 * and surfaced here so we can write `bg-primary`, `text-fg-muted`, etc.
 *
 * Source of truth for the palette is the website's published design tokens
 * (Onti Banden brand). See `globals.css` for the full table.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface2)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",

        fg: {
          DEFAULT: "var(--color-fg)",
          muted: "var(--color-fg-muted)",
          subtle: "var(--color-fg-7)",
          inverse: "var(--color-fg-5)",
        },

        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          fg: "var(--color-on-primary)",
        },

        accent: {
          DEFAULT: "var(--color-accent)",
          fg: "var(--color-on-accent)",
        },

        info: {
          DEFAULT: "var(--color-info)",
          fg: "var(--color-on-info)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          fg: "var(--color-on-success)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          fg: "var(--color-on-warning)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          fg: "var(--color-on-danger)",
        },
      },
      fontFamily: {
        // Barlow is the only font in the brand palette that is freely
        // licensed for self-hosted use (Google Fonts / OFL). The display
        // fonts on the marketing site (Avenir / Lulo Clean / Museo) are
        // licensed via Wix and cannot be reused here.
        sans: ["var(--font-barlow)", "system-ui", "sans-serif"],
        display: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        lg: "0.75rem",
      },
      boxShadow: {
        focus: "0 0 0 3px var(--color-focus-ring)",
      },
    },
  },
  plugins: [animate],
};

export default config;
