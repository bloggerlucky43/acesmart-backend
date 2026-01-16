import { Exam, Results, Student } from "../models/index.js";
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

    console.log(req.body);

    if (!firstName || !studentId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const student = await Student.findOne({
      where: {
        firstName: firstName.trim().toLowerCase(),
        studentId: studentId.trim(),
      },
    });

    console.log("At the student funding", student);

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
    console.error(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort(() => Math.random() - 0.5);
};

export const getExamQuestions = async (req, res) => {
  try {
    const { studentId, examId } = req.params;
    console.log(req.params);

    const student = await Student.findOne({ where: { studentId } });
    console.log("student details are", student);

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

    console.log("exam details", exam);

    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "No active exam found" });
    }

    const examData = exam.toJSON();
    const rawSections = examData.sections || [];

    const sections = rawSections.map((section, index) => {
      console.log(`Processing section ${index + 1}:`, section.section);

      const randomizedQuestions = shuffleArray(section.questions || []).map(
        (q) => {
          // Convert options object → array if needed
          if (
            q.options &&
            typeof q.options === "object" &&
            !Array.isArray(q.options)
          ) {
            q.options = Object.values(q.options);
          }

          // Find the actual correct answer value
          let correctOptionValue;
          if (
            typeof q.correctAnswer === "string" &&
            /^[abcd]$/i.test(q.correctAnswer)
          ) {
            const indexMap = { a: 0, b: 1, c: 2, d: 3 };
            correctOptionValue =
              q.options[indexMap[q.correctAnswer.toLowerCase()]];
          } else {
            correctOptionValue = q.correctAnswer;
          }

          // Shuffle options
          const shuffledOptions = shuffleArray(q.options);

          // Ensure correct answer is the actual text, not a letter
          return {
            ...q,
            options: shuffledOptions,
            correctAnswer: correctOptionValue,
          };
        }
      );

      return { ...section, questions: randomizedQuestions };
    });

    return res.status(200).json({
      success: true,
      message: "Exam fetched successfully",
      exam: { ...examData, sections },
    });
  } catch (error) {
    console.error("❌ Error in getExamQuestions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
export const checkResultExisting = async (req, res) => {
  try {
    const { studentId, examId } = req.params;

    if (!studentId || !examId) {
      return res.status(400).json({
        success: false,
        message: "Student id and exam id are required",
      });
    }

    const existingResult = await Results.findOne({
      where: {
        studentCode: studentId,
        examId,
      },
    });

    console.log("existing result", existingResult);

    return res.status(200).json({
      success: true,
      exists: !!existingResult,
    });
  } catch (error) {
    console.error("Error checking exam results:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const saveExamResult = async (req, res) => {
  try {
    const { resultData } = req.body;
    console.log("The request body is", req.body);

    if (
      !resultData.scores ||
      typeof resultData.scores !== "object" ||
      Array.isArray(resultData.scores)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Scores must be an object" });
    }

    const totalScore = Object.values(resultData.scores).reduce(
      (acc, val) => acc + val,
      0
    );
    const totalMark = resultData?.totalMarks;
    const percentage = (totalScore / totalMark) * 100;

    const result = await Results.create({
      studentId: resultData?.studentId,
      examId: resultData?.examId,
      studentCode: resultData?.studentCode,
      examTitle: resultData?.examTitle,
      scores: resultData?.scores,
      totalScore,
      percentage,
    });

    res.status(200).json({
      success: true,
      message: "Exam result saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error saving exam result", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
