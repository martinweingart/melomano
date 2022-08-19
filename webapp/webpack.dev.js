const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

const devConfig = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: { port: 3001, historyApiFallback: true },
};

module.exports = merge(commonConfig, devConfig);
