import { Exam } from "../models/index.js";
export const createExam = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      duration,
      questions,
      totalMarks,
      passMarks,
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
      !questions.length ||
      !duration ||
      !creatorId ||
      !passMarks ||
      !totalMarks ||
      !negativeMarking === undefined ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let exam;

    if (id) {
      exam = await Exam.findOne({
        where: { id, createdBy: creatorId },
      });
    }

    if (exam) {
      await Exam.update({
        title,
        description,
        duration,
        questions,
        totalMarks,
        passMarks,
        negativeMarking,
        startDate,
        endDate,
      });

      return res
        .status(200)
        .json({ success: true, message: "Exam updated", data: exam });
    }

    const newExam = await Exam.create({
      title,
      description,
      duration,
      questions,
      passMarks,
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
