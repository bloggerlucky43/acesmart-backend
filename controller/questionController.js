import Question from "../models/Question.js";

// export const getQuestions = async (req, res) => {
//   try {
//     const { subject, year } = req.query;

//     if (!subject) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Subject is required to proceed" });
//     }
//     const whereClause = { subject };

//     if (year) whereClause.examYear = year;

//     const questions = await Question.findAll({ where: whereClause });

//     if (!questions.length) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No question found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, count: questions.length, data: questions });
//   } catch (error) {
//     console.error("Error fetching questions", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getQuestions = async (req, res) => {
  try {
    const { subject, year, limit = 120, page = 1 } = req.query;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    const whereClause = { subject };
    if (year) whereClause.examYear = year;

    const parsedLimit = Math.min(Number(limit), 120); // hard cap
    const offset = (Number(page) - 1) * parsedLimit;

    const { rows: questions, count } = await Question.findAndCountAll({
      where: whereClause,
      limit: parsedLimit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "No questions found",
      });
    }

    res.status(200).json({
      success: true,
      total: count,
      page: Number(page),
      limit: parsedLimit,
      totalPages: Math.ceil(count / parsedLimit),
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
