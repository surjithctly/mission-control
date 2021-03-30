if (process.env.NODE_ENV === "production") {
  module.exports = {
    plugins: {
      "@tailwindcss/jit": {},
      autoprefixer: {},
      cssnano: {},
    },
  };
} else {
  module.exports = {
    plugins: {
      "@tailwindcss/jit": {},
      autoprefixer: {},
    },
  };
}
