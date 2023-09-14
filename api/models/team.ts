import DataTypes from "sequelize";
import { sequelize } from "../config/connectDB";
import Player from "./player";

const Team = sequelize.define("Team", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
});

Team.belongsToMany(Player, { through: "TeamPlayers" });
Player.belongsToMany(Team, { through: "TeamPlayers" });

export default Team;
