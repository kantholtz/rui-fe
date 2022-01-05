const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./public/index.html", "./src/**/*.{html,vue,js,ts,jsx,tsx}"],
  purge: ["./public/index.html", "./src/**/*.{html,vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
        sky: colors.sky,
        orange: colors.orange,
      },
    },
  },
  plugins: [],
};
