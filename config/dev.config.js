const { merge } = require("webpack-merge");
const baseConfig = require("./base.config.js");
const webpack = require("webpack");

const mergedConfig = merge(baseConfig, {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        function () {
            this.hooks.done.tap("DonePlugin", (stats) => {
                setTimeout(() => {
                    console.log("\n\n" + "=========================================================");
                    console.log("\t" + new Date().toLocaleString() + " --- DONE");
                    console.log("=========================================================");
                }, 100);
            });
        }
    ]
});

module.exports = mergedConfig;
