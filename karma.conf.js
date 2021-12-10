const process = require("process")
const webpackDev = require("./webpack.dev")

if (!process.env.CHROME_BIN) {
  process.env.CHROME_BIN = require("puppeteer").executablePath()
}

module.exports = (config) => {
  config.set({
    frameworks: ["mocha", "webpack"],

    reporters: ["progress"],

    files: [
      { pattern: "{examples,src,test}/**/*.spec.ts", watched: false },
      { pattern: "{examples,src,test}/**/*", watched: true, included: false, served: false },
    ],

    preprocessors: {
      "{examples,src,test}/**/*.spec.ts": ["webpack"],
    },

    webpack: { ...webpackDev, output: undefined },

    webpackMiddleware: {
      stats: "errors-only",
    },

    client: {
      mocha: {
        reporter: "html",
      },
    },
  })
}
