import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    correctAnswer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    examYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: true,
      defaultValue: "medium",
    },
    source: {
      type: DataTypes.ENUM("api", "teacher"),
      defaultValue: "api",
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    indexes: [
      { unique: true, fields: ["questionText", "subject", "examYear"] },
    ],
  },
  {
    tableName: "questions",
    timestamps: true,
  }
);

export default Question;
