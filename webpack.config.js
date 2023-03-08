const path = require("path");
const nodeExternals = require("webpack-node-externals");
const LoadablePlugin = require("@loadable/webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const DIST_PATH = path.resolve(__dirname, "dist/client");
const production = process.env.NODE_ENV === "production";
const development =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const getConfig = (target) => ({
  name: target,
  stats: "errors-warnings",
  mode: development ? "development" : "production",
  target,
  entry: `./src/client/main-${target}.tsx`,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  optimization: {
    moduleIds: "named",
    chunkIds: "named",
  },
  externals:
    target === "node" ? ["@loadable/component", nodeExternals()] : undefined,
  output: {
    path: path.join(DIST_PATH, target),
    // filename: production ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
    filename: production ? "[name].js" : "[name].js",
    publicPath: `/client/${target}/`,
    libraryTarget: target === "node" ? "commonjs2" : undefined,
  },
  plugins: [new LoadablePlugin(), new MiniCssExtractPlugin()],
});

module.exports = [getConfig("web"), getConfig("node")];
