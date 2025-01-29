const auth = require("basic-auth");

const basicAuth = (req, res, next) => {
  const user = auth(req);

  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (!user || user.name !== username || user.pass !== password) {
    res.set("WWW-Authenticate", 'Basic realm="example"');
    return res.status(401).send("Unauthorized");
  }
  next();
};

module.exports = basicAuth;
