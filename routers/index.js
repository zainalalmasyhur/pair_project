const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

const admin = require("./admin");
const user = require("./user");

// --- Landing Page
router.get("/", Controller.showLandingPage);

// --- Log-In
router.get("/login", Controller.showFormLogin);
router.post("/login", Controller.postUserLogin);

// --- Sign-Up
router.get("/signup", Controller.showFormSignup);
router.post("/signup", Controller.postUserSignup);

// --- Log-Out
router.get("/logout", Controller.logOut);

router.use(function (req,res,next){
    if (!req.session.username) {
        const err = 'tolong login terlebih dahulu'
        res.redirect(`/login?error=${err}`)
    } else {
        next()
    }
})

router.use("/admin", admin);
router.use("/user", user);

module.exports = router;