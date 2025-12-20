import { Results, Student } from "../models/index.js";

export const getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;

    console.log("At getExamResults", req.params);

    const results = await Results.findAll({
      where: { examId },
      include: [
        {
          model: Student,
          attributes: ["id", "firstName", "lastName", "studentId"],
        },
      ],
      // order: [["DESC"]],
    });

    console.log("Fetched results:", results);

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No results found for this exam" });
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
