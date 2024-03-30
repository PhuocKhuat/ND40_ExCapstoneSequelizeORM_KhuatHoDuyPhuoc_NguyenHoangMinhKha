import { Sequelize } from "sequelize";

const connectSequelize = new Sequelize(
  "db_capstone_express_orm",
  "root",
  "nhungkhuong24012001",
  {
    host: "localhost",
    port: "3307",
    dialect: "mysql",
  }
);

try {
  connectSequelize.authenticate();
  console.log("Connected");
} catch (error) {
  console.log("🚀 ~ error:", error);
}

export default connectSequelize;