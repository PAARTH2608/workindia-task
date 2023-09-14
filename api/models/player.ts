import DataTypes from 'sequelize';
import { sequelize } from '../config/connectDB';

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  matches_played: {
    type: DataTypes.INTEGER,
  },
  runs: {
    type: DataTypes.INTEGER,
  },
  average: {
    type: DataTypes.FLOAT,
  },
  strike_rate: {
    type: DataTypes.FLOAT,
  },
});

export default Player;