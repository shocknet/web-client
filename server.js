const Dotenv = require("dotenv");
const Express = require("express");
const Prerender = require("prerender-node");

Dotenv.config();
const app = Express();
const port = process.env.PORT;

app
  .use(Prerender)
  .set("prerenderServiceUrl", process.env.PRERENDER_SERVICE_URL);

app.use(Express.static("build"));

app.listen(port, () => {
  console.log(`Web-client listening at http://localhost:${port}`);
});
