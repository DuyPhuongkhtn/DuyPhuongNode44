import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _users from  "./users.js";

export default function initModels(sequelize) {
  const users = _users.init(sequelize, DataTypes);


  return {
    users,
  };
}
