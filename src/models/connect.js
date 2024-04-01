import { Sequelize } from "sequelize";
import config from "../configs/config.js";

const connectSequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
  }
);

try {
  connectSequelize.authenticate();
  console.log("Connected");
} catch (error) {
  console.log("🚀 ~ error:", error);
}

export default connectSequelize;
