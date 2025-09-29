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
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    questions: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    negativeMarking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    passMarks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 40 },
    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { tableName: "exams", timestamps: true }
);

export default Exam;
