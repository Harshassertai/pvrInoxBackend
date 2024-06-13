const jwt = require("jsonwebtoken");
const { decryptRequest } = require("../utils/crypt");
require("dotenv").config();

const { JWTKEY } = process.env;

function isAuthorizedMail(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(400).json({ message: "Token is not provided." });
    return;
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, JWTKEY, async (err, decodedToken) => {
    let tokenData = await decryptRequest(decodedToken?.data);
    let { email } = JSON.parse(tokenData);
    let authorizedEmails = [
      "Harsh.mishra@assertai.com",
      "Rajesh.roy@assertai.com",
    ];
    if (authorizedEmails.includes(email)) {
      if (err) {
        let { expiredAt } = err;
        return res.status(400).json({
          message: "Token Expired,Login Again.",
        });
      } else {
        next();
      }
    } else {
      return res.status(404).json({
        message: "You Are Not Authorized",
      });
    }
  });
}

module.exports = { isAuthorizedMail };
