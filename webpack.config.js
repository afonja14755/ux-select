const path = require("path");

module.exports = {
  entry: {
    "ux-select": path.join(__dirname, "src", "ux-select.js"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].min.js"
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', {targets: "defaults"}]
            ]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ],
      }
    ]
  }
}

if (process.env.NODE_ENV !== 'production') {
  module.exports['devtool'] = 'source-map';
}
