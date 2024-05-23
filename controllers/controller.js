const { where } = require("sequelize");
const { User, Tag, Profile, Post, Post_Tag } = require("../models/index");
const bcrypt = require('bcryptjs');

class Controller {
    // --- Landing Page
    static showLandingPage(req, res) {
        res.render("landing-page", {title: "SocialSync"});
    }

    // --- Log-In
    static async showFormLogin(req, res) {
        try {
            res.render("login", {title: "Login Form"});

        } catch (error) {
            res.send(error.message);
        }
    }

    static async postUserLogin(req, res) {
        try {
            let {username,password} = req.body
            let data = await User.findOne({
                where:{
                    email : username
                }
            })
            
            if (data) {
                let passwordValidator = bcrypt.compareSync(password, data.password)

                console.log(passwordValidator);
                
                if (passwordValidator) {
                   return res.redirect(`/user`)
                }else{
                    let err = "invalid password"
                   return res.redirect(`/login?err=${err}`)
                }
            } else {
                let err = "invalid Username"
               return res.redirect(`/login?err=${err}`)
            }

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Sign-Up
    static async showFormSignup(req, res) {
        try {
            res.render("signup", {title: "Sign Up Form"})

        } catch (error) {
            res.send(error.message);
        }
    }

    static async postUserSignup(req, res) {
        try {
            let { username, email, password, role } = req.body;
            
            await User.create({ username, email, password, role });

            res.redirect(`/login`);

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Home
    static async home(req, res) {
        try {
            let option = {
                where: {
                    role: "user",
                    id: 1
                },
                include: Profile,
            }

            let { UserId } = req.params;

            let dataPost = await User.findAll(option);
            // res.send(dataPost);

            res.render("user/home-user", {title: "Home", dataPost});

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- User Profile Page
    static async showUserProfile(req, res) {
        try {
            res.render("user/user-profile", {title: "User Profile"})

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Tags Page
    static async showTags(req, res) {
        try {
            res.send("Halaman Tags")
        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Create Post (User)
    static async formAddContent(req, res) {
        try {
            res.render("user/create-post", {title: "Create New Post"})
            // res.send("Form Add Content");
        } catch (error) {
            res.send(error.message);
        }
    }

    static async postNewContent(req, res) {
        try {
            res.send("Post New Content")
        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Update Post (User)
    static async formEditContent(req, res) {
        try {
            res.send("Form Edit Content")
        } catch (error) {
            res.send(error.message);
        }
    }

    static async postEditedContent(req, res) {
        try {
            res.send("Post Edited Content")
        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Delete Post (User)
    static async deleteContent(req, res) {
        try {
            res.send("Delete Content")
        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Admin Page
    static async showAdminPage(req, res) {
        try {
            res.send("Halaman Admin");
        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Delete User Account (Admin)
    static async deleteAccount(req, res) {
        try {
            res.send("Delete Account")
        } catch (error) {
            res.send(error.message);
        }
    }
}

module.exports = Controller;