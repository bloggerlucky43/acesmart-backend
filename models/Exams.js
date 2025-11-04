import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Exam = sequelize.define(
  "Exam",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    sections: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    negativeMarking: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 100,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  { tableName: "exams", timestamps: true }
);

export default Exam;
