const express = require("express");
const Router = express.Router();
const {
  createUser,
  updateUser,
  deleteUser,
  listUser,
} = require("../controllers/UserManagement/User.contoller");
const { isAuthenticated } = require("../middleware/TokenCheck");
Router.post("/createUser", createUser);
Router.get("/userslist", listUser);
Router.post("/deleteUser", deleteUser);
Router.post("/editUser", updateUser);

module.exports = Router;
