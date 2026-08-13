import type { Config } from "tailwindcss";
import { theme } from "./src/config/theme";

const config: Config = {
  darkMode: "class",

  content: ["./src/**/*.{ts,tsx,mdx}"],

  theme: {
    container: {
      center: true,
      padding: "1rem",
    },

    extend: {
      colors: {
        nexora: theme.colors,
      },

      borderRadius: theme.radius,

      boxShadow: theme.shadows,

      spacing: theme.spacing,

      maxWidth: theme.containers,

      fontFamily: {
        sans: [...theme.fontFamily.body],
        display: [...theme.fontFamily.display],
        heading: [...theme.fontFamily.heading],
        mono: [...theme.fontFamily.mono],
      },

      fontSize: Object.fromEntries(
        Object.entries(theme.fontSize).map(([key, value]) => {
          const [fontSize, sizeConfig] = value;

          return [
            key,
            [
              fontSize,
              {
                ...sizeConfig,
              },
            ],
          ];
        }),
      ) as Record<
        string,
        [string, Record<string, string | number>]
      >,

      transitionDuration: theme.animation.duration,

      transitionTimingFunction: theme.animation.easing,

      screens: theme.breakpoints,

      backdropBlur: theme.blur,

      perspective: {
        500: "500px",
        800: "800px",
        1000: "1000px",
        1200: "1200px",
        1500: "1500px",
      },

      transformStyle: {
        preserve: "preserve-3d",
      },

      keyframes: {
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },

        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(22px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "fade-down": {
          from: {
            opacity: "0",
            transform: "translateY(-22px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "scale-in": {
          from: {
            opacity: "0",
            transform: "scale(0.94)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },

        "slide-left": {
          from: {
            opacity: "0",
            transform: "translateX(24px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        "slide-right": {
          from: {
            opacity: "0",
            transform: "translateX(-24px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-9px)",
          },
        },

        "glow-pulse": {
          "0%, 100%": {
            opacity: "0.55",
            filter: "brightness(0.95)",
          },
          "50%": {
            opacity: "1",
            filter: "brightness(1.15)",
          },
        },

        "orb-pulse": {
          "0%, 100%": {
            opacity: "0.65",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.08)",
          },
        },

        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },

        "gradient-flow": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },

        "page-enter": {
          from: {
            opacity: "0",
            transform: "translateY(14px) scale(0.995)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },

        "card-enter": {
          from: {
            opacity: "0",
            transform:
              "perspective(1200px) translateY(25px) rotateX(4deg)",
          },
          to: {
            opacity: "1",
            transform:
              "perspective(1200px) translateY(0) rotateX(0deg)",
          },
        },

        "ambient-pulse": {
          "0%, 100%": {
            opacity: "0.65",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.04)",
          },
        },

        "border-glow": {
          "0%, 100%": {
            boxShadow: "0 0 0 rgba(241,178,74,0)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(241,178,74,0.16)",
          },
        },
      },

      animation: {
        "fade-in": "fade-in 420ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-up": "fade-up 520ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-down": "fade-down 520ms cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 420ms cubic-bezier(0.16,1,0.3,1) both",
        "slide-left":
          "slide-left 500ms cubic-bezier(0.16,1,0.3,1) both",
        "slide-right":
          "slide-right 500ms cubic-bezier(0.16,1,0.3,1) both",
        float: "float 5s ease-in-out infinite",
        "orb-pulse": "orb-pulse 5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "gradient-flow": "gradient-flow 8s ease infinite",
        "page-enter":
          "page-enter 650ms cubic-bezier(0.16,1,0.3,1) both",
        "card-enter":
          "card-enter 650ms cubic-bezier(0.22,1,0.36,1) both",
        "ambient-pulse": "ambient-pulse 7s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
      },

      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        transform: "transform, translate, scale, rotate",
        colors:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
        shadow: "box-shadow",
        glass:
          "background-color, border-color, box-shadow, backdrop-filter",
        all: "all",
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};

export default config;