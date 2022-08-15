const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

const devConfig = {
  mode: "development",
  output: {
    publicPath: "/",
  },
  devtool: "inline-source-map",
  devServer: { port: 8080 },
};

module.exports = merge(commonConfig, devConfig);
