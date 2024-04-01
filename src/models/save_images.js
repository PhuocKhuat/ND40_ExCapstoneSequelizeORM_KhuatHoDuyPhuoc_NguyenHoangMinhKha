import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class save_images extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    img_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'images',
        key: 'img_id'
      }
    },
    date_save: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_saved: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'save_images',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "img_id" },
        ]
      },
      {
        name: "img_id",
        using: "BTREE",
        fields: [
          { name: "img_id" },
        ]
      },
    ]
  });
  }
}
