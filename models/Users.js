const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize/sequelize.js");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 8,
      max: 700
    },
  },
  biografia:{
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Solteiro",
  }
});

module.exports = User