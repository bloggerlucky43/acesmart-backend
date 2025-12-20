import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Results = sequelize.define(
  "Results",
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
    studentCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scores: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    totalScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    examTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  { tableName: "result", timestamps: true }
);

export default Results;
