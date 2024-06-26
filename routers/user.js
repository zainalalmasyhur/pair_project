const express = require("express");
const user = express.Router();
const Controller = require("../controllers/controller");

user.get("/:UserId/setting", Controller.formSetting);
user.post("/:UserId/setting", Controller.postSetting);
user.get("/:UserId/home", Controller.home);
user.get("/:UserId/profile", Controller.showUserProfile);
user.get("/:UserId/content/add", Controller.formAddContent);
user.post("/:UserId/content/add", Controller.postNewContent);
user.get("/:UserId/setting/edit", Controller.formEditSetting);
user.post("/:UserId/setting/edit", Controller.postEditSetting);
user.get("/:UserId/content/:PostId", Controller.showDetailContent);
user.get("/:UserId/content/:PostId/edit", Controller.formEditContent);
user.post("/:UserId/content/:PostId/edit", Controller.postEditedContent);
// user.get("/:UserId/content/:PostId/delete", Controller.deleteContent);

module.exports = user;