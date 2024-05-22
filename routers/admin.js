const express = require("express");
const admin = express.Router();
const Controller = require("../controllers/controller");

admin.get("/", Controller.showAdminPage);
admin.get("/delete/:id", Controller.deleteAccount);

module.exports = admin;