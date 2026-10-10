const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Theme colors carry <alpha-value> so opacity modifiers (bg-muted/50,
      // border-border/60, bg-destructive/10…) are actually generated.
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        brand: {
          DEFAULT: "hsl(var(--brand) / <alpha-value>)",
          // No <alpha-value>: that would make `bg-brand-secondary` set the
          // --tw-bg-opacity CSS variable, and NativeWind remounts (and crashes
          // in dev) when a variable appears after the first render, e.g. when
          // a tab button switches from active to inactive.
          secondary: "hsl(var(--brand-secondary))",
          foreground: "hsl(var(--brand-foreground))",
        },
        success: "hsl(var(--success) / <alpha-value>)",
        info: "hsl(var(--info) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        tabbar: {
          DEFAULT: "hsl(var(--tabbar))",
          foreground: "hsl(var(--tabbar-foreground))",
          active: "hsl(var(--tabbar-active))",
          "active-foreground": "hsl(var(--tabbar-active-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
