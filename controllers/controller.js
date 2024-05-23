const { where } = require("sequelize");
const { User, Tag, Profile, Post, Post_Tag } = require("../models/index");
const bcrypt = require('bcryptjs');
const { convert } = require('../helpers/index');
const { title } = require("process");
const { Op } = require("sequelize");



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

                // console.log(passwordValidator);
               if (data.role === 'admin') {
                return res.redirect(`/admin`)
               }
                
                if (passwordValidator) {
                    req.session.username = data.email
                    if (!data.displayName) {
                        await User.nodeMailer(data.email)
                        return res.redirect(`/user/${data.id}/setting`)
                    } else {
                        return res.redirect(`/user/${data.id}/home`)
                    }
                }else{
                    let err = "invalid password"
                   return res.redirect(`/login?err=${err}`)
                }
            } else {
                let err = "invalid Username"
               return res.redirect(`/login?err=${err}`)
            }

            if (!data.displayName) {

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
            let { username, email, password} = req.body;
            
            await User.create({ username, email, password});

            res.redirect(`/login`);

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Setting
    static async formSetting(req, res) {
        try {
            let { UserId } = req.params;

            res.render("user/user-setting", {title: "Setting", UserId});

        } catch (error) {
            res.send(error.message);
        }
    }

    static async postSetting(req, res) {
        try {
            let { UserId } = req.params;

            let user = await User.findByPk(UserId);
            // res.send(username)

            let username = user.username

            let { imgProfile, displayName, bio } = req.body;
            await Profile.create({ imgProfile, displayName, username, bio, UserId })
            // res.send(req.body)
            console.log(req.body)
            
            res.redirect(`/user/${UserId}/home`)

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Home
    static async home(req, res) {
        try {
            let { UserId } = req.params;
            
            let option = {
            where: {
                    role: "user",
                    id: 1
                },
                include: Profile,
            }

            let dataPost = await User.findAll(option);
            // res.send(dataPost);

            res.render("user/home-user", {title: "Home", dataPost, convert});

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- User Profile Page
    static async showUserProfile(req, res) {
        try {
            res.render("user/user-profile", {title: "User Profile", convert})

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

            let {search} = req.query

            let option = {
                include: Profile,
                where: {
                    role: 'user'
                }
            }

            if (search) {
                option.where.username = {
                    [Op.iLike]: `%${search}%`
                }
            }

            console.log(option);

            let data = await User.findAll(option)

            // res.send(data)

            // res.send(data)
            res.render("admin/home-admin",{title: "admin page",data,convert});
        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Delete User Account (Admin)
    static async deleteAccount(req, res) {
        try {
            let {id} = req.params

            await Profile.destroy({
                where: {
                    id: id
                }
            })

            res.redirect('/admin')
        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Log-Out
    static async logOut(req, res){
        try {
            req.session.destroy()
            res.redirect(`/login`)
        } catch (error) {
            res.send(error.message);
        }
    }
}

module.exports = Controller;