const { User, Tag, Profile, Post, Post_Tag } = require("../models/index");
const bcrypt = require('bcryptjs');
const { Op, where } = require("sequelize");
const { convert, timeAgo } = require('../helpers/index')
const { title } = require("process");

class Controller {
    // --- Landing Page
    static showLandingPage(req, res) {
        res.render("landing-page", {title: "SocialSync"});
    }

    // --- Log-In
    static async showFormLogin(req, res) {
        try {
            let { err } = req.query;

            res.render("login", {title: "Login Form", err});

        } catch (error) {
            res.send(error.message);
        }
    }

    static async postUserLogin(req, res) {
        try {
            let {username,password} = req.body
            let data = await User.findOne({
                include: Profile,
                where:{
                    email : username
                }
            })

            if (data) {
                let passwordValidator = bcrypt.compareSync(password, data.password)

                if (data.role === 'admin') {
                    return res.redirect(`/admin`)
                }

                if (passwordValidator) {
                    req.session.username = data.email
                  
                    if (!data.Profile) {
                        return res.redirect(`/user/${data.id}/setting`)
                    }
                  
                    await User.nodeMailer(data.email)
                    return res.redirect(`/user/${data.id}/home`)

                }else{
                    let err = "invalid password"
                   return res.redirect(`/login?err=${err}`)
                }
            } else {
                let err = "invalid Email Address"
               return res.redirect(`/login?err=${err}`)
            }

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Sign-Up
    static async showFormSignup(req, res) {
        try {
            let { err } = req.query;

            res.render("signup", {title: "Sign Up Form", err})

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
            if (error.name === "SequelizeValidationError") {
                let errors = error.errors.map(err => err.message);
                res.redirect(`/signup?err=${errors}`)
            } else {
                res.send(error.message);
            }
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
            let username = user.username

            let { imgProfile, displayName, bio } = req.body;

            await Profile.create({ imgProfile, displayName, username, bio, UserId })
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
                    id: UserId
                },
                include: Profile,
            }

            let optionFilter = {
                where: {
                    id: {
                        [Op.ne]: UserId
                    },
                },
                include: Profile            
            }

            let optionPosts = {
                include: [
                    {
                        model: User,
                        include: [
                            {
                                model: Post,
                                include: [
                                    {
                                        model: Post_Tag,
                                        include: [Tag]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            // let optionPost = {
            //     where: {
            //         id: {
            //             [Op.ne]: UserId
            //         },
            //     },
            //     include: Post            
            // }

            let cardPosts = await Profile.findAll(optionPosts);
            let dataTags = await Tag.findAll();
            // let postUser = await User.findAll({include})
            // let detailFeed = await User.findAll(optionPost)
            let feed = await User.findAll(optionFilter)
            let dataPost = await User.findAll(option);

            // res.send(cardPosts[0].User.Posts[0])

            res.render("user/home-user", {title: "Home", dataPost, convert, timeAgo, UserId, feed, cardPosts, dataTags});

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- User Profile Page
    static async showUserProfile(req, res) {
        try {
            let { UserId } = req.params;

            let dataUser = await User.findByPk(UserId, {include: Profile});
            let dataPosts = await User.findOne({where: {id: UserId}, include: Post});

            res.render("user/user-profile", {title: "User Profile", convert, UserId, dataUser, dataPosts})

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Create Post (User)
    static async formAddContent(req, res) {
        try {
            let { UserId, PostId } = req.params;

            let dataTags = await Tag.findAll();
            let dataUser = await User.findByPk(UserId, {include: Profile});

            // res.send(dataTags)
            res.render("user/create-post", {title: "Create New Post", UserId, dataUser, dataTags})

        } catch (error) {
            res.send(error.message);
        }
    }

    static async postNewContent(req, res) {
        try {
            let { UserId } = req.params;
            let { title, content, imgUrl, TagId } = req.body;

            let perTag = TagId.forEach(tag => {
                return Number(tag);
            })
            // console.log(perTag);

            await Post.create({ title, content, imgUrl, UserId });
            await Post_Tag.create({ perTag });

            res.redirect(`/user/${UserId}/profile`);

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Detail Post (User) 
    static async showDetailContent(req, res) {
        try {
            let { UserId, PostId } = req.params;
            
            let dataUser = await User.findByPk(UserId, {include: Profile});
            let dataPost = await Post.findByPk(PostId);
            let dataTags = await Tag.findAll();

            res.render("user/detail-content", {title: "Detail Post", UserId, PostId, dataPost, dataUser, dataTags});

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Update Post (User)
    static async formEditContent(req, res) {
        try {
            let { UserId, PostId } = req.params;
            
            let dataUser = await User.findByPk(UserId, {include: Profile});
            let dataPost = await Post.findByPk(PostId);
            res.render("user/form-edit-content", {title: "Form Edit Post", UserId, PostId, dataPost, dataUser});

        } catch (error) {
            res.send(error.message);
        }
    }

    static async postEditedContent(req, res) {
        try {
            let { UserId, PostId } = req.params;
            let { title, content, imgUrl } = req.body;

            await Post.update({ title, content, imgUrl }, { where: {id: PostId} });
            res.redirect(`/user/${UserId}/profile`)

        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Setting Profile
    static async formEditSetting(req, res) {
        try {
            let { UserId } = req.params;

            let dataProfile = await User.findByPk(UserId, {include: Profile})

            // res.send(dataProfile);
            res.render("user/update-setting", {title: "Setting User", dataProfile, UserId});
        } catch (error) {
            res.send(error.message);
        }
    }

    static async postEditSetting(req, res) {
        try {
            let { UserId } = req.params;
            let { imgProfile, displayName, username, bio } = req.body;

            await Profile.update({ imgProfile, displayName, username, bio }, {where: {UserId}});
            res.redirect(`/user/${UserId}/profile`);

        } catch (error) {
            res.send(error.message);
        }
    }



    // // --- Delete Post (User)
    // static async deleteContent(req, res) {
    //     try {
    //         let { UserId, PostId } = req.params;
            
    //         // console.log(req.query)
    //         await Post_Tags.destroy({where: {PostId: PostId}});
    //         res.redirect(`user/${UserId}/profile`)
    //         // res.send("Delete Content")
    //     } catch (error) {
    //         res.send(error.message);
    //     }
    // }

    // --- Admin Page
    static async showAdminPage(req, res) {
        try {

            let {search, deletedProfile} = req.query

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
            res.render("admin/home-admin",{title: "admin page",data,convert,deletedProfile});
        } catch (error) {
            res.send(error.message);
        }
    }

    // --- Delete User Account (Admin)
    static async deleteAccount(req, res) {
        try {
            let {id} = req.params

            // let profile_user = await Profile.findByPk(id)
            let profile_user = await Profile.findOne({where: {UserId: id}});
            let name = profile_user.username;

            // res.send(name)
            await profile_user.destroy()
            res.redirect(`/admin?deletedProfile=${name}`);
            
            // res.redirect('/admin')
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