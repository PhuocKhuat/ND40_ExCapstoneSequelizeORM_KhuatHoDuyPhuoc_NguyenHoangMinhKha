import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _chat from  "./chat.js";
import _comments from  "./comments.js";
import _images from  "./images.js";
import _save_images from  "./save_images.js";
import _users from  "./users.js";

export default function initModels(sequelize) {
  const chat = _chat.init(sequelize, DataTypes);
  const comments = _comments.init(sequelize, DataTypes);
  const images = _images.init(sequelize, DataTypes);
  const save_images = _save_images.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  images.belongsToMany(users, { as: 'user_id_users', through: save_images, foreignKey: "img_id", otherKey: "user_id" });
  users.belongsToMany(images, { as: 'img_id_images', through: save_images, foreignKey: "user_id", otherKey: "img_id" });
  comments.belongsTo(images, { as: "img", foreignKey: "img_id"});
  images.hasMany(comments, { as: "comments", foreignKey: "img_id"});
  save_images.belongsTo(images, { as: "img", foreignKey: "img_id"});
  images.hasMany(save_images, { as: "save_images", foreignKey: "img_id"});
  chat.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(chat, { as: "chats", foreignKey: "user_id"});
  comments.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(comments, { as: "comments", foreignKey: "user_id"});
  images.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(images, { as: "images", foreignKey: "user_id"});
  save_images.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(save_images, { as: "save_images", foreignKey: "user_id"});

  return {
    chat,
    comments,
    images,
    save_images,
    users,
  };
}
