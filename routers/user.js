const express = require("express");
const user = express.Router();
const Controller = require("../controllers/controller");

user.get("/:UserId/setting", Controller.formSetting);
user.post("/:UserId/setting", Controller.postSetting);
user.get("/:UserId/home", Controller.home);
user.get("/:UserId/profile", Controller.showUserProfile);
user.get("/:UserId/content/add", Controller.formAddContent);
user.post("/:UserId/content/add", Controller.postNewContent);
user.get("/:UserId/tags/:TagId", Controller.showTags);
user.get("/:UserId/content/edit/:PostId", Controller.formEditContent);
user.post("/:UserId/content/edit/:PostId", Controller.postEditedContent);
user.get("/:UserId/content/delete/:PostId", Controller.deleteContent);

module.exports = user;