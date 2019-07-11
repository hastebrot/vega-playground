const path = require("path")
const babel = require("./babel.config.js")

module.exports = function({ env, paths }) {
  return {
    devServer: {
      port: 9010,
      open: false,
    },
    babel: babel,
    eslint: {
      enable: false,
    },
    webpack: {
      configure: (config, { env, paths }) => {
        return config
      },
    },
    jest: {
      configure: {
        moduleFileExtensions: ["js", "json"],
        transform: {
          "^.+\\.js$": "babel-jest",
        },
        testEnvironment: "node",
        testMatch: ["**/src/**/*.(test|spec).js"],
        testPathIgnorePatterns: ["/node_modules/"],
      },
    },
  }
}
