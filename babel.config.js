module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-runtime",
    "babel-plugin-dynamic-import-node",
  ],
  env: {
    test: {},
  },
}
