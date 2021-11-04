const webpackDev = require("../../webpack.dev");

module.exports = (config) => {
    config.set({
        logLevel: config.LOG_INFO,

        frameworks: ["mocha", "webpack"],

        reporters: ["progress"],

        files: [
            {pattern: "{examples,src,test}/**/*.spec.ts", watched: false},
            {pattern: "{examples,src,test}/**/*", watched: true, included: false, served: false},
        ],

        preprocessors: {
            "{examples,src,test}/**/*.spec.ts": ["webpack", "electron"]
        },

        webpack: {
            target: "electron-renderer",
            module: webpackDev.module,
            resolve: webpackDev.resolve,
            mode: webpackDev.mode,
            devtool: webpackDev.devtool
        },

        webpackMiddleware: {
            stats: "errors-only"
        },

        customLaunchers: {
            CustomElectron: {
                base: "Electron",
                require: __dirname + "/src/__TEST/main.boot.js",
                /**
                 * @typedef Electron.BrowserWindowConstructorOptions
                 */
                browserWindowOptions: {
                    show: false,
                    webPreferences: {
                        contextIsolation: false,
                        nodeIntegration: true,
                        nativeWindowOpen: true,
                    }
                }
            }
        },

        browsers: ["CustomElectron"],

        client: {
            useIframe: false,
            mocha: {
                reporter: "html"
            }
        }
    });
};
