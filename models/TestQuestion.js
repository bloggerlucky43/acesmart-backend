import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TestQuestion = sequelize.define(
  "TestQuestion",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    testId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    uniqueKeys: {
      test_question_unique: { fields: ["testId", "questionId"] },
    },
  },
  { tableName: "test_questions", timestamps: false }
);

export default TestQuestion;
