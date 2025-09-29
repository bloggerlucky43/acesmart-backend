import User from "./User.js";
import Exam from "./Exams.js";
import sequelize from "../config/db.js";

//Test belongs to a creator(teacher,admin)
Exam.belongsTo(User, { foreignKey: "createdBy" });
User.hasMany(Exam, { foreignKey: "createdBy" });

// await sequelize.sync({ alter: true })
export { User, Exam };
