import Question from "../models/Question.js";
import axios from "axios";

// async function importAPIQuestions(subject, year) {
//   try {
//     const url = `https://questions.aloc.com.ng/api/v2/q/20?subject=${subject}&year=${year}`;
//     console.log(url);

//     const response = await axios.get(url, {
//       headers: {
//         AccessToken: `QB-d535ebf450b7934545ad`,
//       },
//     });
//     console.log(response);

//     const data = response.data;
//     console.log(data);

//     const formattedQuestions = data.map((q) => ({
//       questionText: q.question,
//       options: q.options,
//       correctAnswer: q.answer,
//       subject: q.subject,
//       topic: q.topic,
//       examYear: q.year,
//       difficulty: q.difficulty || "medium",
//       source: "api",
//       imageUrl: q.image || null,
//     }));
//     await Question.bulkCreate(formattedQuestions);
//     console.log(`✅ Imported ${formattedQuestions.length} questions from API`);
//   } catch (error) {
//     console.error(
//       "❌ Error importing from ALOC:",
//       error.response?.data || error.message
//     );
//   }
// }

// importAPIQuestions("chemistry", 2000);

export const getQuestions = async (req, res) => {
  try {
    const { subject, year } = req.query;

    if (!subject) {
      return res
        .status(400)
        .json({ success: false, message: "Subject is required to proceed" });
    }
    const whereClause = { subject };

    if (year) whereClause.examYear = year;

    const questions = await Question.findAll({ where: whereClause });

    if (!questions.length) {
      return res
        .status(404)
        .json({ success: false, message: "No question found" });
    }

    res
      .status(200)
      .json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    console.error("Error fetching questions", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
