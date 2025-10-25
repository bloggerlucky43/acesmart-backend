import User from "./User.js";
import Exam from "./Exams.js";
import sequelize from "../config/db.js";
import Student from "./Student.js";
//Test belongs to a creator(teacher,admin)
Exam.belongsTo(User, { foreignKey: "createdBy" });
User.hasMany(Exam, { foreignKey: "createdBy" });

//students relationship
User.hasMany(Student, { foreignKey: "teacherId" });
Student.belongsTo(User, { foreignKey: "teacherId" });
await sequelize.sync({ alter: true });
export { User, Exam, Student };
