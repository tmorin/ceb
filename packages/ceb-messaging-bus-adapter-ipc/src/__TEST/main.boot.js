const electron = require("electron")
const webpack = require("webpack")
const webpackConf = require("./webpack.tpl")

webpack(webpackConf, (err) => {
    if (err) {
        console.error(err)
        process.exit(9999)
    }
    require("./main.generated")
    electron.webContents.getAllWebContents().forEach(webContent => webContent.send("main-ready"))
})
