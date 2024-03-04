import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        darkTheme: {
          primary: "#f9009d",
          secondary: "#006baf",
          accent: "#2b00ff",
          neutral: "#050509",
          "base-100": "#242424",
          info: "#3dc1ff",
          success: "#8cbd00",
          warning: "#ce8c00",
          error: "#ff8a99",
          body: {
            "background-color": "#101010",
          },
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
