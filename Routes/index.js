const express = require("express");
const Router = express.Router();

const AuthRoutes = require("../Routes/Auth");
const UsersRoutes = require("../Routes/Users");

Router.use("/Auth", AuthRoutes);
Router.use("/Users", UsersRoutes);
module.exports = Router;
