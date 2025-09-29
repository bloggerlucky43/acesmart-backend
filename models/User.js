import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// function generateStudentID() {
//   const year = new Date().getFullYear();
//   const randomNum = Math.floor(1000 + Math.random() * 9000);
//   return `ACE-${year}-${randomNum}`;
// }

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "teacher", "student"),
      allowNull: false,
      defaultValue: "student",
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ["username"], unique: true },
      { fields: ["email"], unique: true },
    ],
  }
);

export default User;
