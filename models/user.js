'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Post)
      this.hasOne(models.Profile)
      
    }

    static async nodeMailer(email){
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'zainalalmasyhur30@gmail.com',
          pass: 'xjtr xpch bmah vuts'
        }
      });
      
      let mailOptions = {
        from: 'zainalalmasyhur30@gmail.com',
        to: email,
        subject: 'Registration mail',
        text: 'you have succesfully registered'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
    }




  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async (user, options) => {
    const salt = bcrypt.genSaltSync(8);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash
    user.role = 'user'
  });

  return User;
};