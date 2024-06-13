const express = require("express");
const Router = express.Router();
const { Login } = require("../controllers/Auths/UserAuth.js");

Router.post("/login", Login);

module.exports = Router;
