const express = require("express");
const user = express.Router();
const Controller = require("../controllers/controller");

user.get("/", Controller.home);
user.get("/profile", Controller.showUserProfile);
user.get("/content/add", Controller.formAddContent);
user.post("/content/add", Controller.postNewContent);
user.get("/tags/:id", Controller.showTags);
user.get("/content/edit/:id", Controller.formEditContent);
user.post("/content/edit/:id", Controller.postEditedContent);
user.get("/content/delete/:id", Controller.deleteContent);

module.exports = user;