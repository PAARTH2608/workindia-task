import DataTypes from "sequelize";
import { sequelize } from "../config/connectDB";
import Team from "./team";

const Match = sequelize.define("Match", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  team_1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team_2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  squads: {
    type: DataTypes.JSONB, // You can use JSONB to store the squads as JSON
    allowNull: false,
  },
});

Match.belongsTo(Team, { as: "team1", foreignKey: "team_1" });
Match.belongsTo(Team, { as: "team2", foreignKey: "team_2" });

export default Match;
