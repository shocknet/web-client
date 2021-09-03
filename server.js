const FS = require("fs");
const Dotenv = require("dotenv");
const Express = require("express");
const Prerender = require("prerender-node");
const Path = require("path");
Dotenv.config();

const app = Express();
const port = process.env.PORT;

app
  .use(Prerender)
  .set("prerenderServiceUrl", process.env.PRERENDER_SERVICE_URL);

const getStaticFilePath = filePath => Path.join(__dirname, "build", filePath);

const fileExists = filePath =>
  new Promise(resolve => {
    FS.stat(getStaticFilePath(filePath), (err, stats) => {
      if (err) {
        resolve(false);
        return;
      }

      resolve(stats.isFile);
    });
  });

app.get(["*", "/"], async (req, res) => {
  const staticFileExists = await fileExists(req.path);
  if (staticFileExists && req.path !== "/") {
    res.sendFile(getStaticFilePath(req.path));
    return;
  }
  res.sendFile(getStaticFilePath("index.html"));
});

app.listen(port, () => {
  console.log(`Web-client listening at http://localhost:${port}`);
});
