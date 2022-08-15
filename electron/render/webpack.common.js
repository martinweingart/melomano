const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: [
              ["@babel/plugin-transform-runtime"],
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "h",
                  pragmaFrag: "Fragment",
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|woff|svg|eot|ttf)$/i,
        use: [{ loader: "file-loader" }],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/assets/favicon.ico",
    }),
  ],
};
