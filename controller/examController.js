import { Exam, Student } from "../models/index.js";
import { Op } from "sequelize";
export const createExam = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      duration,
      sections,
      totalMarks,
      negativeMarking,
      startDate,
      endDate,
    } = req.body;
    console.log("reqest body", req.body);

    const creatorId = req.user.id;

    console.log("Creator ID", creatorId, req.body);

    if (
      !title ||
      !description ||
      !sections.length ||
      !duration ||
      !creatorId ||
      !totalMarks ||
      !negativeMarking === undefined ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newExam = await Exam.create({
      title,
      description,
      duration,
      sections,
      createdBy: creatorId,
      totalMarks,
      negativeMarking,
      startDate,
      endDate,
    });

    console.log("the result", newExam);

    res.status(201).json({ success: true, data: newExam });
  } catch (error) {
    console.error("Error creating exam", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getExamsByCreator = async (req, res) => {
  try {
    const creatorId = req.user.id;

    const exams = await Exam.findAll({ where: { createdBy: creatorId } });

    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const studentExamLogin = async (req, res) => {
  try {
    const { firstName, studentId } = req.body;

    const student = await Student.findOne({
      where: {
        firstName: firstName.trim().toLowerCase(),
        studentId: studentId.trim(),
      },
    });

    if (!student) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Login Credentials" });
    }

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      student,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (Math.floor(Math.random() * (i + 1))[(shuffled[1], shuffled[j])] =
      [shuffled[j], shuffled[i]]);
  }
  return shuffled;
};

export const getExamQuestions = async (req, res) => {
  try {
    const { studentId, examId } = req.params;

    const student = await Student.findOne({ where: { id: studentId } });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const now = new Date();

    const exam = await Exam.findOne({
      where: {
        id: examId,
        createdBy: student.teacherId,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
      },
    });

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "No active exam found" });
    }

    console.log("Exam questions are", exam);

    //randomize questions in each seciton

    const sections = exam.sections?.map((section) => {
      const randomizedQuestions = shuffleArray(section.questions || []);

      console.log("Reshuffled sections are ;", randomizedQuestions);
      return { ...section, questions: randomizedQuestions };
    });

    return res.status(200).json({
      success: true,
      message: "Exam fetched successfully",
      exam: { ...exam.toJSON(), sections },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
