const { Sequelize } = require("sequelize");
require("dotenv").config();

// importing thre environment variables
const DATABASE = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;
const DB_PORT = process.env.DB_PORT;

// initializing the new sequelize object
export const sequelize = new Sequelize(DATABASE, "me", PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  port: DB_PORT,
});