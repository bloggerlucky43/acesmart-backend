import User from "./User.js";
import Exam from "./Exams.js";
import sequelize from "../config/db.js";
import Student from "./Student.js";
import Results from "./Result.js";
import Question from "./Question.js";
//Test belongs to a creator(teacher,admin)
Exam.belongsTo(User, { foreignKey: "createdBy" });
User.hasMany(Exam, { foreignKey: "createdBy" });

//In your models index file
Exam.hasMany(Results, { foreignKey: "examId" });
Results.belongsTo(Exam, { foreignKey: "examId" });

Student.hasMany(Results, { foreignKey: "studentId" });
Results.belongsTo(Student, { foreignKey: "studentId" });

//students relationship
User.hasMany(Student, { foreignKey: "teacherId" });
Student.belongsTo(User, { foreignKey: "teacherId" });

Results.belongsTo(Student, { foreignKey: "studentId" });
Results.belongsTo(Exam, { foreignKey: "examId" });
await sequelize.sync({ alter: true });
export { User, Exam, Student, Results, Question };
