/**
 * NEXORA — Advanced Design System
 *
 * Single source of truth for:
 * brand colors, surfaces, typography, spacing,
 * radii, shadows, motion and responsive breakpoints.
 */

export const theme = {
  colors: {
    bg: "#222223",
    "bg-deep": "#1B191A",
    "bg-secondary": "#164A41",

    surface: "#2B292A",
    "surface-soft": "#343132",
    "surface-raised": "#3D393A",
    "surface-elevated": "#4A4445",

    border: "rgba(254, 254, 254, 0.12)",
    "border-soft": "rgba(254, 254, 254, 0.07)",
    "border-strong": "rgba(254, 254, 254, 0.22)",

    red: "#B62A2D",
    "red-soft": "#E6A8A8",
    coral: "#D5575E",

    cream: "#E9E4E0",
    brown: "#943A1F",
    black: "#1B191A",

    yellow: "#F1B24A",
    green: "#164A41",
    "green-muted": "#4D774E",
    sage: "#9DC88D",

    white: "#FEFEFE",

    text: "#FEFEFE",
    "text-soft": "#E9E4E0",
    muted: "#B9B1AD",
    "muted-2": "#918985",
    "muted-3": "#6F6966",

    success: "#9DC88D",
    warning: "#F1B24A",
    danger: "#B62A2D",
    info: "#4D774E",

    gradients: {
      brand:
        "linear-gradient(135deg, #B62A2D 0%, #F1B24A 48%, #164A41 100%)",

      red:
        "linear-gradient(135deg, #B62A2D 0%, #D5575E 55%, #943A1F 100%)",

      green:
        "linear-gradient(135deg, #164A41 0%, #4D774E 55%, #9DC88D 100%)",

      warm:
        "linear-gradient(135deg, #943A1F 0%, #F1B24A 100%)",

      editorial:
        "linear-gradient(135deg, #1B191A 0%, #E9E4E0 100%)",

      hero:
        "radial-gradient(circle at 18% 20%, rgba(182,42,45,0.24), transparent 38%), radial-gradient(circle at 82% 15%, rgba(241,178,74,0.16), transparent 34%), radial-gradient(circle at 50% 82%, rgba(22,74,65,0.20), transparent 42%)",

      glow:
        "radial-gradient(circle, rgba(241,178,74,0.22), transparent 68%)",

      glass:
        "linear-gradient(135deg, rgba(254,254,254,0.09), rgba(254,254,254,0.025))",
    },
  },

  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    card: "20px",
    xl: "24px",
    "2xl": "32px",
    pill: "999px",
  },

  shadows: {
    card: "0 12px 40px -16px rgba(0, 0, 0, 0.65)",

    cardHover:
      "0 24px 70px -20px rgba(0, 0, 0, 0.78)",

    panel:
      "inset 0 1px 0 rgba(254,254,254,0.045), 0 12px 40px -16px rgba(0,0,0,0.62)",

    glowRed:
      "0 0 70px -20px rgba(182,42,45,0.48)",

    glowYellow:
      "0 0 70px -20px rgba(241,178,74,0.42)",

    glowGreen:
      "0 0 70px -20px rgba(157,200,141,0.34)",

    glowBrown:
      "0 0 70px -20px rgba(148,58,31,0.42)",

    button:
      "0 10px 30px -12px rgba(182,42,45,0.48)",
  },

  spacing: {
    "section-y": "7rem",
    "section-y-lg": "9rem",
    "section-y-sm": "4rem",

    gutter: "1.5rem",
    "gutter-sm": "1rem",
    "gutter-lg": "2rem",

    "hero-y": "8rem",
    "hero-y-mobile": "5rem",
  },

  containers: {
    content: "1200px",
    hero: "1440px",
    article: "740px",
    wide: "1600px",
  },

  fontFamily: {
    display: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
    ],

    heading: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
    ],

    body: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
    ],

    mono: [
      "JetBrains Mono",
      "ui-monospace",
      "SFMono-Regular",
      "monospace",
    ],
  },

  fontSize: {
    display: [
      "clamp(3rem, 7vw, 6.5rem)",
      {
        lineHeight: "0.96",
        letterSpacing: "-0.055em",
        fontWeight: "800",
      },
    ],

    h1: [
      "clamp(2.5rem, 5vw, 4.5rem)",
      {
        lineHeight: "1",
        letterSpacing: "-0.045em",
        fontWeight: "800",
      },
    ],

    h2: [
      "clamp(2rem, 3.5vw, 3rem)",
      {
        lineHeight: "1.08",
        letterSpacing: "-0.035em",
        fontWeight: "750",
      },
    ],

    h3: [
      "clamp(1.35rem, 2vw, 1.75rem)",
      {
        lineHeight: "1.2",
        letterSpacing: "-0.02em",
        fontWeight: "700",
      },
    ],

    h4: [
      "1.25rem",
      {
        lineHeight: "1.35",
        fontWeight: "650",
      },
    ],

    body: [
      "1.0625rem",
      {
        lineHeight: "1.75",
        fontWeight: "400",
      },
    ],

    small: [
      "0.9375rem",
      {
        lineHeight: "1.6",
        fontWeight: "400",
      },
    ],

    caption: [
      "0.8125rem",
      {
        lineHeight: "1.4",
        fontWeight: "600",
      },
    ],

    metadata: [
      "0.75rem",
      {
        lineHeight: "1.4",
        fontWeight: "600",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      },
    ],
  },

  breakpoints: {
    xs: "400px",
    sm: "480px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  blur: {
    glass: "18px",
    strong: "28px",
    soft: "10px",
  },

  animation: {
    duration: {
      instant: "100ms",
      micro: "140ms",
      fast: "180ms",
      normal: "280ms",
      smooth: "420ms",
      emphasis: "650ms",
      cinematic: "900ms",
    },

    easing: {
      standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      out: "cubic-bezier(0.16, 1, 0.3, 1)",
      in: "cubic-bezier(0.7, 0, 0.84, 0)",
      spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      dramatic: "cubic-bezier(0.76, 0, 0.24, 1)",
    },
  },

  limits: {
    trendingCount: 5,
    latestCount: 8,
    categoryPreviewCount: 4,
    articlesPerPage: 12,
    toolsPerPage: 24,
    relatedArticles: 3,
    relatedTools: 3,
    searchResultsPerPage: 10,
  },
} as const;

export type NexoraTheme = typeof theme;