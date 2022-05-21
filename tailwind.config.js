module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2f478d",
        laonGray: "#979797",
      },
    },
  },
  plugins: [],
  prefix: "tw-",
  mode: "jit",
};
