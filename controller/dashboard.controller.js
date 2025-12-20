import { Student, Exam, Question } from "../models/index.js";

export const dashboardStats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    console.log("teacher id", teacherId);

    // Fetch student count
    const studentCount = await Student.count({ where: { teacherId } });

    // Fetch exam count
    const examCount = await Exam.count({ where: { createdBy: teacherId } });

    // Fetch question count
    const questionCount = await Question.count({
      where: { createdBy: teacherId },
    });

    return res.status(200).json({
      success: true,
      data: {
        studentCount,
        examCount,
        questionCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
