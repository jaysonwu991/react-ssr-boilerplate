import path from "path";
import React from "react";
import express from "express";
import serialize from "serialize-javascript";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

const app = express();

app.use(express.static(path.join(__dirname, "../")));

if (process.env.NODE_ENV !== "production") {
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const { default: webpackConfig } = require("../../webpack.config");

  const compiler = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(compiler, {
      logLevel: "silent",
      publicPath: "/client/web",
      writeToDisk(filePath: string) {
        return /dist\/node\//.test(filePath) || /loadable-stats/.test(filePath);
      },
    })
  );
}

const nodeStats = path.resolve(
  __dirname,
  "../client/node/loadable-stats.json"
);

const webStats = path.resolve(
  __dirname,
  "../client/web/loadable-stats.json"
);

app.get("*", (_req, res) => {
  const nodeExtractor = new ChunkExtractor({
    statsFile: nodeStats,
  });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const webExtractor = new ChunkExtractor({
    statsFile: webStats,
    entrypoints: ["main"],
  });
  const jsx = webExtractor.collectChunks(<App />);

  const html = renderToString(jsx);

  const appProps = { name: "Jayson" };

  res.set("content-type", "text/html");
  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
        <script>
          ;window.INITIAL_DATA = ${serialize({ appProps })}
        </script>
        ${webExtractor.getLinkTags()}
        ${webExtractor.getStyleTags()}
        </head>
        <body>
          <div id="main">${html}</div>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
    `);
});

// eslint-disable-next-line no-console
app.listen(9000, () => console.log("Server started http://localhost:9000"));
