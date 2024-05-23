'use strict';
const {
  Model
} = require('sequelize');
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
  return Profile;
};