/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#76A8D8BF",
        "primary-dark": "#76A8D8",
        "primary-darker": "#495AFF",
        secondary: "#5E92C4",
        curawedaColor: "#02CCFF",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    daisyui: {
      themes: ["light", "dark", "cupcake"],
    },
  },
};
