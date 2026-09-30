/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: "#0A0B0A",
        },
        panel: {
          base: "#131513",
          elevated: "#191B18",
          inset: "#1E211D",
        },
        border: {
          subtle: "#23261F",
          strong: "#31352C",
        },
        text: {
          primary: "#EEF0EA",
          secondary: "#9BA096",
          muted: "#62675C",
        },
        accent: {
          DEFAULT: "#34D399",
          dim: "#0E2019",
          border: "#0F3D2E",
        },
        risk: {
          DEFAULT: "#F0554A",
          dim: "#211110",
          border: "#3D1815",
        },
        warning: {
          DEFAULT: "#F0AA3D",
          dim: "#261F12",
          border: "#453316",
        }
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'panel': '12px',
        'card': '8px',
      }
    },
  },
  plugins: [],
}
