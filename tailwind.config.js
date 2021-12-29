const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        stone: colors.stone,
        sky: colors.sky,
        orange: colors.orange,
        "lavis-red": {
          500: "rgb(225, 0, 25)",
        },
      },
    },
  },
  plugins: [],
};
