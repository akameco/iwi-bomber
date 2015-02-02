/* global module, __dirname */
module.exports = {
    entry: "./main.coffee",
    output: {
        path: __dirname,
        filename: "main.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.coffee$/, loader: "coffee" }
        ]
    }
};
