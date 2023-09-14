import DataTypes from "sequelize";
import { sequelize } from "../config/connectDB";
import Player from "./player";

const Team = sequelize.define("Team", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Team.belongsToMany(Player, { through: "TeamPlayers" });
Player.belongsToMany(Team, { through: "TeamPlayers" });

export default Team;
