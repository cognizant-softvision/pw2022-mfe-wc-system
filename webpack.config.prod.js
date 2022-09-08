const { ModuleFederationPlugin } = require("webpack").container;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
require("dotenv").config({ path: "./.env" });

const { REMOTE } = process.env;

const path = require("path");

module.exports = {
  mode: "production",
  entry: { 
    web_components: path.resolve(__dirname, "./src/define-all-elements.js"),
    styles: path.resolve(__dirname, "./styles/css/styles.js"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
    publicPath: REMOTE,
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
    minimize: true,
    chunkIds: 'named',
    // splitChunks: false
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024, // < 3 Kilobytes will be inlined
          },
        },
      },
      {
        test: /\.(html|css)$/,
        include: [
          path.resolve(__dirname, "./src/")
        ],
        type: "asset/source",
      },
      {
        test: /\.css$/i,
        include: [
          path.resolve(__dirname, "./styles/")
        ],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "wc_system",
      filename: "remoteEntry.js",
      exposes: {
        "./all-elements": "./src/define-all-elements.js",
        "./checkbox-icon": "./src/define-checkbox-icon-element.js",
        "./levels": "./src/define-levels-element.js",
        "./login": "./src/define-login-element.js",
        "./multiselect": "./src/define-multiselect-element.js",
        "./stepper": "./src/define-stepper-element.js",
        "./stepper-item": "./src/define-stepper-item-element.js",
        "./stepper-json": "./src/define-stepper-json-element.js",
        "./modal": './src/define-modal-element.js',
        "./flipcard": "./src/define-flipcard-element.js",
        "./test": "./src/define-test-element.js",
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public" }, path.resolve(__dirname, "./public")],
    }),
  ],
};