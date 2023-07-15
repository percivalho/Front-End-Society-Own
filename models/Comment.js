const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    playlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'playlist',
        key: 'id',
      },      
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },      
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: true,     
    modelName: 'comment',
  }
);

module.exports = Comment;
