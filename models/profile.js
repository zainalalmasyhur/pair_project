'use strict';
const {
  Model
} = require('sequelize');
const { use } = require('../routers');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User)
    }

    get timeAgo() {
    const seconds = Math.floor((new Date() - this.createdAt) / 1000);

    const interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    if (interval === 1) {
        return interval + " year ago";
    }

    const months = Math.floor(seconds / 2628000);
    if (months > 1) {
        return months + " months ago";
    }
    if (months === 1) {
        return months + " month ago";
    }

    const days = Math.floor(seconds / 86400);
    if (days > 1) {
        return days + " days ago";
    }
    if (days === 1) {
        return days + " day ago";
    }

    const hours = Math.floor(seconds / 3600);
    if (hours > 1) {
        return hours + " hours ago";
    }
    if (hours === 1) {
        return hours + " hour ago";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes > 1) {
        return minutes + " minutes ago";
    }
    if (minutes === 1) {
        return minutes + " minute ago";
    }

    return "just now";
}

  }
  Profile.init({
    username: DataTypes.STRING,
    displayName: DataTypes.STRING,
    posts: DataTypes.STRING,
    followers: DataTypes.INTEGER,
    following: DataTypes.INTEGER,
    bio: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    imgProfile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });

  Profile.beforeCreate(async (user, options) => {
    if (!user.imgProfile) {
      user.imgProfile = 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg'
    }
   user.followers = 0
   user.following = 0
   user.posts = 0
  });

  return Profile;
};