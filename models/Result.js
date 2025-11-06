import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Result = sequelize.define(
  "Result",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    examId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    scores: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    totalScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    examTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  { tableName: "results", timestamps: true }
);

export default Result;
